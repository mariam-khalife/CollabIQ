from uuid import UUID

from models import (  # path bootstrapped in ai/__init__.py
    Interest,
    MatchSuggestion,
    Project,
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
from sqlalchemy.orm import Session

from . import matching, recommendations

# A team leader is shown at most this many candidates per matching run.
MAX_SUGGESTIONS = 5
# A team is shown at most this many project ideas per generation run.
MAX_RECOMMENDATIONS = 5


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


def generate_project_recommendations(
    db: Session, team_id: UUID, count: int = MAX_RECOMMENDATIONS
) -> list[ProjectRecommendation]:
    count = min(count, MAX_RECOMMENDATIONS)

    team = db.get(Team, team_id)
    if team is None:
        raise ValueError(f"Team {team_id} not found")

    member_user_ids = [row.user_id for row in db.query(TeamMember).filter_by(team_id=team_id)]
    member_user_ids.append(team.leader_id)

    skills = [
        name
        for (name,) in db.query(Skill.name)
        .join(UserSkill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id.in_(member_user_ids))
        .distinct()
    ]
    interests = [
        name
        for (name,) in db.query(Interest.name)
        .join(UserInterest, UserInterest.interest_id == Interest.id)
        .filter(UserInterest.user_id.in_(member_user_ids))
        .distinct()
    ]
    experience_levels = [
        level
        for (level,) in db.query(User.experience_level)
        .filter(User.id.in_(member_user_ids), User.experience_level.isnot(None))
    ]

    # The prompt asks for exactly `count` ideas, but the model's compliance is
    # not guaranteed - enforce the cardinality here, and never wipe the cached
    # recommendations for an empty answer.
    ideas = recommendations.generate_project_ideas(skills, interests, experience_levels, count=count)
    if not ideas:
        raise RuntimeError("LLM returned no project ideas - previous recommendations kept")
    ideas = ideas[:count]

    # Refresh the cache, but never delete a recommendation the team has already
    # accepted: projects.recommendation_id references it (NOT NULL FK), so
    # deleting it would fail - and the team's chosen project must stay traceable.
    accepted_ids = db.query(Project.recommendation_id).filter_by(team_id=team_id)
    db.query(ProjectRecommendation).filter(
        ProjectRecommendation.team_id == team_id,
        ProjectRecommendation.id.notin_(accepted_ids),
    ).delete(synchronize_session=False)

    rows = []
    for idea in ideas:
        row = ProjectRecommendation(
            team_id=team_id,
            title=idea.title,
            description=idea.description,
            difficulty_level=idea.difficulty_level,
            required_technologies=idea.required_technologies,
            confidence_score=idea.confidence_score,
        )
        db.add(row)
        rows.append(row)

    db.commit()
    return rows
