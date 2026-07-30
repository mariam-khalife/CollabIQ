import sys
from pathlib import Path
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.interest import Interest, UserInterest
from app.models.project import Project
from app.models.project_recommendation import (
    ProjectRecommendation,
)
from app.models.skill import Skill, UserSkill
from app.models.team import Team, TeamMember
from app.models.user import User


# Make the root-level ai package importable while
# FastAPI is running from the backend directory.
_REPOSITORY_ROOT = Path(__file__).resolve().parents[3]

if str(_REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPOSITORY_ROOT))


from ai.recommendations import (  # noqa: E402
    generate_project_ideas,
)


MAX_RECOMMENDATIONS = 5


def get_team(
    db: Session,
    team_id: UUID,
) -> Team | None:
    return (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )


def is_team_member(
    db: Session,
    team: Team,
    user_id: UUID,
) -> bool:
    if team.leader_id == user_id:
        return True

    membership = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team.id,
            TeamMember.user_id == user_id,
        )
        .first()
    )

    return membership is not None


def get_team_user_ids(
    db: Session,
    team: Team,
) -> list[UUID]:
    member_ids = [
        row[0]
        for row in (
            db.query(TeamMember.user_id)
            .filter(TeamMember.team_id == team.id)
            .all()
        )
    ]

    if team.leader_id not in member_ids:
        member_ids.append(team.leader_id)

    return member_ids


def get_project_recommendations(
    db: Session,
    team_id: UUID,
    current_user: User,
):
    team = get_team(
        db,
        team_id,
    )

    if not team:
        return "team_not_found"

    if not is_team_member(
        db,
        team,
        current_user.id,
    ):
        return "not_team_member"

    return (
        db.query(ProjectRecommendation)
        .filter(
            ProjectRecommendation.team_id == team_id
        )
        .order_by(
            ProjectRecommendation.confidence_score.desc(),
            ProjectRecommendation.created_at.desc(),
        )
        .limit(MAX_RECOMMENDATIONS)
        .all()
    )


def generate_project_recommendations(
    db: Session,
    team_id: UUID,
    current_user: User,
    count: int = MAX_RECOMMENDATIONS,
):
    team = get_team(
        db,
        team_id,
    )

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    safe_count = min(
        max(count, 1),
        MAX_RECOMMENDATIONS,
    )

    member_user_ids = get_team_user_ids(
        db,
        team,
    )

    skills = [
        row[0]
        for row in (
            db.query(Skill.name)
            .join(
                UserSkill,
                UserSkill.skill_id == Skill.id,
            )
            .filter(
                UserSkill.user_id.in_(
                    member_user_ids
                )
            )
            .distinct()
            .all()
        )
    ]

    interests = [
        row[0]
        for row in (
            db.query(Interest.name)
            .join(
                UserInterest,
                UserInterest.interest_id
                == Interest.id,
            )
            .filter(
                UserInterest.user_id.in_(
                    member_user_ids
                )
            )
            .distinct()
            .all()
        )
    ]

    experience_levels = [
        row[0]
        for row in (
            db.query(User.experience_level)
            .filter(
                User.id.in_(member_user_ids),
                User.experience_level.isnot(None),
            )
            .all()
        )
    ]

    try:
        ideas = generate_project_ideas(
            skills=skills,
            interests=interests,
            experience_levels=experience_levels,
            count=safe_count,
        )
    except Exception:
        db.rollback()
        raise

    if not ideas:
        raise RuntimeError(
            "The AI returned no project recommendations"
        )

    ideas = ideas[:safe_count]

    # Preserve recommendations already selected by a project.
    accepted_recommendation_ids = [
        row[0]
        for row in (
            db.query(Project.recommendation_id)
            .filter(
                Project.team_id == team_id,
                Project.recommendation_id.isnot(None),
            )
            .all()
        )
    ]

    old_recommendations_query = (
        db.query(ProjectRecommendation)
        .filter(
            ProjectRecommendation.team_id == team_id
        )
    )

    if accepted_recommendation_ids:
        old_recommendations_query = (
            old_recommendations_query.filter(
                ProjectRecommendation.id.notin_(
                    accepted_recommendation_ids
                )
            )
        )

    old_recommendations_query.delete(
        synchronize_session=False
    )

    generated_recommendations = []

    for idea in ideas:
        recommendation = ProjectRecommendation(
            team_id=team_id,
            title=idea.title,
            description=idea.description,
            difficulty_level=(
                idea.difficulty_level
            ),
            required_technologies=(
                idea.required_technologies
            ),
            confidence_score=(
                idea.confidence_score
            ),
        )

        db.add(recommendation)
        generated_recommendations.append(
            recommendation
        )

    db.commit()

    for recommendation in generated_recommendations:
        db.refresh(recommendation)

    return generated_recommendations