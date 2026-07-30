from uuid import UUID

from sqlalchemy.orm import Session

from app.ai.teammate_recommendation import (
    Candidate,
    ProjectRequirements,
    recommend_teammates,
)
from app.models.interest import Interest, UserInterest
from app.models.invitation import TeamInvitation
from app.models.project_recommendation import ProjectRecommendation
from app.models.skill import Skill, UserSkill
from app.models.team import Team, TeamMember
from app.models.user import User


EXPERIENCE_LEVELS = {
    "beginner": 1,
    "junior": 1,
    "intermediate": 3,
    "mid": 3,
    "advanced": 5,
    "senior": 5,
    "expert": 5,
}


def normalize_text(value: str | None) -> str:
    return (value or "").strip().lower()


def normalize_collection(values: list[str] | set[str]) -> set[str]:
    return {
        normalize_text(value)
        for value in values
        if value and value.strip()
    }


def get_numeric_experience(value: str | None) -> int:
    return EXPERIENCE_LEVELS.get(normalize_text(value), 1)


def get_user_skills(db: Session, user_id: UUID) -> list[str]:
    rows = (
        db.query(Skill.name)
        .join(UserSkill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id == user_id)
        .all()
    )
    return [row[0] for row in rows]


def get_user_interests(db: Session, user_id: UUID) -> list[str]:
    rows = (
        db.query(Interest.name)
        .join(UserInterest, UserInterest.interest_id == Interest.id)
        .filter(UserInterest.user_id == user_id)
        .all()
    )
    return [row[0] for row in rows]


def is_user_available(value: str | None) -> bool:
    return normalize_text(value) not in {
        "",
        "unavailable",
        "not available",
        "false",
        "no",
    }


def get_teammate_recommendations(
    db: Session,
    team_id: UUID,
    current_user: User,
    target_role: str,
    required_skills: list[str] | None = None,
    required_interests: list[str] | None = None,
    minimum_score: float = 0,
    maximum_results: int = 5,
):
    team = db.query(Team).filter(Team.id == team_id).first()

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    member_user_ids = {
        row[0]
        for row in (
            db.query(TeamMember.user_id)
            .filter(TeamMember.team_id == team_id)
            .all()
        )
    }
    member_user_ids.add(team.leader_id)

    pending_user_ids = {
        row[0]
        for row in (
            db.query(TeamInvitation.invited_user_id)
            .filter(
                TeamInvitation.team_id == team_id,
                TeamInvitation.status == "pending",
            )
            .all()
        )
    }

    latest_project_recommendation = (
        db.query(ProjectRecommendation)
        .filter(ProjectRecommendation.team_id == team_id)
        .order_by(ProjectRecommendation.created_at.desc())
        .first()
    )

    resolved_required_skills = (
        required_skills
        or (
            latest_project_recommendation.required_technologies
            if (
                latest_project_recommendation
                and latest_project_recommendation.required_technologies
            )
            else []
        )
    )

    normalized_required_skills = normalize_collection(
        resolved_required_skills
    )
    normalized_required_interests = normalize_collection(
        required_interests or []
    )

    database_candidates = (
        db.query(User)
        .filter(
            User.id.notin_(
                member_user_ids | pending_user_ids
            )
        )
        .all()
    )

    engine_candidates = []
    candidate_details = {}

    for user in database_candidates:
        user_skills = get_user_skills(db, user.id)
        user_interests = get_user_interests(db, user.id)
        user_id = str(user.id)

        engine_candidates.append(
            Candidate(
                user_id=user_id,
                name=user.full_name,
                role="",
                skills=normalize_collection(user_skills),
                interests=normalize_collection(user_interests),
                experience_level=get_numeric_experience(
                    user.experience_level
                ),
                is_available=is_user_available(
                    user.availability
                ),
            )
        )

        candidate_details[user_id] = {
            "email": user.email,
            "university": user.university,
            "bio": user.bio,
            "availability": user.availability,
            "experience_level": user.experience_level,
            "skills": user_skills,
            "interests": user_interests,
        }

    requirements = ProjectRequirements(
        missing_role=target_role,
        required_skills=normalized_required_skills,
        required_interests=normalized_required_interests,
        min_experience_level=5,
        requires_availability=True,
    )

    safe_maximum = min(max(maximum_results, 1), 5)

    engine_results = recommend_teammates(
        engine_candidates,
        requirements,
        max_results=safe_maximum,
    )

    recommendations = []

    for result in engine_results:
        if result["compatibility_score"] < minimum_score:
            continue

        details = candidate_details[result["user_id"]]

        recommendations.append(
            {
                "user_id": UUID(result["user_id"]),
                "name": result["name"],
                "email": details["email"],
                "role": result["role"],
                "compatibility_score":
                    result["compatibility_score"],
                "reason": result["reason"],
                "university": details["university"],
                "bio": details["bio"],
                "availability": details["availability"],
                "experience_level":
                    details["experience_level"],
                "skills": details["skills"],
                "interests": details["interests"],
            }
        )

    return recommendations