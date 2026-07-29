from uuid import UUID

from sqlalchemy.orm import Session

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
    normalized_value = normalize_text(value)

    return EXPERIENCE_LEVELS.get(
        normalized_value,
        1,
    )


def get_user_skills(
    db: Session,
    user_id: UUID,
) -> list[str]:
    rows = (
        db.query(Skill.name)
        .join(
            UserSkill,
            UserSkill.skill_id == Skill.id,
        )
        .filter(UserSkill.user_id == user_id)
        .all()
    )

    return [row[0] for row in rows]


def get_user_interests(
    db: Session,
    user_id: UUID,
) -> list[str]:
    rows = (
        db.query(Interest.name)
        .join(
            UserInterest,
            UserInterest.interest_id == Interest.id,
        )
        .filter(UserInterest.user_id == user_id)
        .all()
    )

    return [row[0] for row in rows]


def calculate_overlap_score(
    candidate_values: set[str],
    required_values: set[str],
) -> float:
    if not candidate_values or not required_values:
        return 0.0

    matching_values = (
        candidate_values & required_values
    )

    return len(matching_values) / len(required_values)


def generate_reason(
    skills: list[str],
    interests: list[str],
    required_skills: set[str],
    required_interests: set[str],
    target_role: str,
    compatibility_score: float,
) -> str:
    matched_skills = [
        skill
        for skill in skills
        if normalize_text(skill) in required_skills
    ]

    matched_interests = [
        interest
        for interest in interests
        if normalize_text(interest)
        in required_interests
    ]

    reason_parts = []

    if matched_skills:
        reason_parts.append(
            "matches the required skills: "
            + ", ".join(matched_skills[:4])
        )

    if matched_interests:
        reason_parts.append(
            "shares relevant interests in "
            + ", ".join(matched_interests[:3])
        )

    if target_role:
        reason_parts.append(
            f"can contribute as {target_role}"
        )

    if not reason_parts:
        return (
            "The candidate has a compatible profile "
            "and may complement the current team."
        )

    return (
        "This candidate "
        + "; ".join(reason_parts)
        + f". Overall compatibility: "
        + f"{round(compatibility_score * 100)}%."
    )


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
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

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
            db.query(
                TeamInvitation.invited_user_id
            )
            .filter(
                TeamInvitation.team_id == team_id,
                TeamInvitation.status == "pending",
            )
            .all()
        )
    }

    latest_project_recommendation = (
        db.query(ProjectRecommendation)
        .filter(
            ProjectRecommendation.team_id == team_id
        )
        .order_by(
            ProjectRecommendation.created_at.desc()
        )
        .first()
    )

    resolved_required_skills = (
        required_skills
        or (
            latest_project_recommendation
            .required_technologies
            if latest_project_recommendation
            and latest_project_recommendation
            .required_technologies
            else []
        )
    )

    normalized_required_skills = (
        normalize_collection(
            resolved_required_skills
        )
    )

    normalized_required_interests = (
        normalize_collection(
            required_interests or []
        )
    )

    candidates = (
        db.query(User)
        .filter(
            User.id.notin_(
                member_user_ids | pending_user_ids
            )
        )
        .all()
    )

    recommendations = []

    for candidate in candidates:
        candidate_skills = get_user_skills(
            db,
            candidate.id,
        )

        candidate_interests = get_user_interests(
            db,
            candidate.id,
        )

        normalized_candidate_skills = (
            normalize_collection(candidate_skills)
        )

        normalized_candidate_interests = (
            normalize_collection(
                candidate_interests
            )
        )

        skill_score = calculate_overlap_score(
            normalized_candidate_skills,
            normalized_required_skills,
        )

        interest_score = calculate_overlap_score(
            normalized_candidate_interests,
            normalized_required_interests,
        )

        experience_score = min(
            get_numeric_experience(
                candidate.experience_level
            )
            / 5,
            1,
        )

        availability_value = normalize_text(
            candidate.availability
        )

        availability_score = (
            1.0
            if availability_value
            not in {
                "",
                "unavailable",
                "not available",
                "false",
                "no",
            }
            else 0.0
        )

        role_score = 1.0 if target_role else 0.0

        compatibility_score = round(
            (
                skill_score * 0.40
                + role_score * 0.25
                + interest_score * 0.15
                + experience_score * 0.10
                + availability_score * 0.10
            ),
            4,
        )

        if compatibility_score < minimum_score:
            continue

        recommendations.append(
            {
                "user_id": candidate.id,
                "name": candidate.full_name,
                "email": candidate.email,
                "role": target_role,
                "compatibility_score":
                    compatibility_score,
                "reason": generate_reason(
                    candidate_skills,
                    candidate_interests,
                    normalized_required_skills,
                    normalized_required_interests,
                    target_role,
                    compatibility_score,
                ),
                "university":
                    candidate.university,
                "bio": candidate.bio,
                "availability":
                    candidate.availability,
                "experience_level":
                    candidate.experience_level,
                "skills": candidate_skills,
                "interests":
                    candidate_interests,
            }
        )

    recommendations.sort(
        key=lambda recommendation: (
            -recommendation[
                "compatibility_score"
            ],
            recommendation["name"].lower(),
        )
    )

    safe_maximum = min(
        max(maximum_results, 1),
        5,
    )

    return recommendations[:safe_maximum]