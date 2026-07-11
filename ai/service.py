import sys
from pathlib import Path
from uuid import UUID

DATABASE_DIR = Path(__file__).resolve().parent.parent / "database"
if str(DATABASE_DIR) not in sys.path:
    sys.path.insert(0, str(DATABASE_DIR))

from models import (  # noqa: E402
    Interest,
    MatchSuggestion,
    ProjectRecommendation,
    Role,
    Skill,
    Team,
    TeamInvitation,
    TeamMember,
    User,
    UserInterest,
    UserSkill,
)
from sqlalchemy.orm import Session  # noqa: E402

from . import matching, recommendations  # noqa: E402

# A team leader is shown at most this many candidates per matching run.
MAX_SUGGESTIONS = 5


def _suggest_role_for_skill(db: Session, skill_id: UUID | None) -> Role | None:
    if skill_id is None:
        return None
    skill = db.get(Skill, skill_id)
    if skill is None or not skill.category:
        return None
    return db.query(Role).filter(Role.role_name.ilike(f"%{skill.category}%")).first()


def generate_match_suggestions(
    db: Session, team_id: UUID, required_skill_ids: list[UUID], count: int = MAX_SUGGESTIONS
) -> list[MatchSuggestion]:
    count = min(count, MAX_SUGGESTIONS)

    team = db.get(Team, team_id)
    if team is None:
        raise ValueError(f"Team {team_id} not found")

    # Candidates must be genuinely available: not the leader, not already a
    # member, and not already holding a pending invitation to this team.
    excluded_user_ids = {row.user_id for row in db.query(TeamMember).filter_by(team_id=team_id)}
    excluded_user_ids.add(team.leader_id)
    excluded_user_ids.update(
        row.invited_user_id
        for row in db.query(TeamInvitation).filter_by(team_id=team_id, status="pending")
    )

    candidates = []
    for user in db.query(User).filter(User.id.notin_(excluded_user_ids)):
        skills = {row.skill_id: row.proficiency_level for row in db.query(UserSkill).filter_by(user_id=user.id)}
        candidates.append(matching.CandidateProfile(user_id=user.id, skills=skills))

    results = matching.rank_candidates(required_skill_ids, candidates, count)

    db.query(MatchSuggestion).filter_by(team_id=team_id).delete()
    suggestions = []
    for result in results:
        role = _suggest_role_for_skill(db, result.suggested_skill_id)
        if role is None:
            continue
        suggestion = MatchSuggestion(
            team_id=team_id,
            suggested_user_id=result.user_id,
            suggested_role_id=role.id,
            match_score=result.match_score,
        )
        db.add(suggestion)
        suggestions.append(suggestion)

    db.commit()
    return suggestions


def generate_project_recommendations(db: Session, team_id: UUID, count: int = 3) -> list[ProjectRecommendation]:
    team = db.get(Team, team_id)
    if team is None:
        raise ValueError(f"Team {team_id} not found")

    member_user_ids = [row.user_id for row in db.query(TeamMember).filter_by(team_id=team_id)]
    member_user_ids.append(team.leader_id)

    skill_ids = {row.skill_id for row in db.query(UserSkill).filter(UserSkill.user_id.in_(member_user_ids))}
    skills = [row.name for row in db.query(Skill).filter(Skill.id.in_(skill_ids))]

    interest_ids = {row.interest_id for row in db.query(UserInterest).filter(UserInterest.user_id.in_(member_user_ids))}
    interests = [row.name for row in db.query(Interest).filter(Interest.id.in_(interest_ids))]

    ideas = recommendations.generate_project_ideas(skills, interests, count=count)

    db.query(ProjectRecommendation).filter_by(team_id=team_id).delete()
    rows = []
    for idea in ideas:
        row = ProjectRecommendation(
            team_id=team_id,
            title=idea.title,
            description=idea.description,
            confidence_score=idea.confidence_score,
        )
        db.add(row)
        rows.append(row)

    db.commit()
    return rows
