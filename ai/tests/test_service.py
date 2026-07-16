import os
import sys
import uuid
from pathlib import Path

import pytest
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

DATABASE_DIR = Path(__file__).resolve().parent.parent.parent / "database"
if str(DATABASE_DIR) not in sys.path:
    sys.path.insert(0, str(DATABASE_DIR))

from models import (  # noqa: E402
    Role,
    Skill,
    Team,
    TeamInvitation,
    User,
    UserSkill,
)

from ai import service  # noqa: E402

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/collabiq")


@pytest.fixture
def db():
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    try:
        yield session
    finally:
        session.close()
        if transaction.is_active:
            transaction.rollback()
        connection.close()


def _make_user(db, full_name, email):
    user = User(full_name=full_name, email=email, password_hash="x")
    db.add(user)
    db.flush()
    return user


def test_generate_match_suggestions_persists_ranked_candidates(db):
    backend_role = Role(role_name="Backend Developer")
    frontend_role = Role(role_name="Frontend Developer")
    backend_skill = Skill(name="FastAPI", category="Backend")
    db.add_all([backend_role, frontend_role, backend_skill])
    db.flush()

    leader = _make_user(db, "Leader", "leader@example.com")
    strong_candidate = _make_user(db, "Strong", "strong@example.com")
    weak_candidate = _make_user(db, "Weak", "weak@example.com")

    db.add(UserSkill(user_id=strong_candidate.id, skill_id=backend_skill.id, proficiency_level="advanced"))
    db.add(UserSkill(user_id=weak_candidate.id, skill_id=backend_skill.id, proficiency_level="beginner"))

    team = Team(team_name="Team A", leader_id=leader.id)
    db.add(team)
    db.flush()

    suggestions = service.generate_match_suggestions(db, team.id, [backend_skill.id], count=5)

    assert len(suggestions) == 2
    assert suggestions[0].suggested_user_id == strong_candidate.id
    assert suggestions[0].match_score == 1.0
    assert suggestions[0].suggested_role_id == backend_role.id


def test_leader_is_never_suggested_for_their_own_team(db):
    role = Role(role_name="Backend Developer")
    skill = Skill(name="FastAPI", category="Backend")
    db.add_all([role, skill])
    db.flush()

    leader = _make_user(db, "Leader", "skilled-leader@example.com")
    db.add(UserSkill(user_id=leader.id, skill_id=skill.id, proficiency_level="advanced"))

    team = Team(team_name="Team L", leader_id=leader.id)
    db.add(team)
    db.flush()

    suggestions = service.generate_match_suggestions(db, team.id, [skill.id], count=5)

    assert all(s.suggested_user_id != leader.id for s in suggestions)


def test_user_with_pending_invitation_is_not_suggested(db):
    role = Role(role_name="Backend Developer")
    skill = Skill(name="FastAPI", category="Backend")
    db.add_all([role, skill])
    db.flush()

    leader = _make_user(db, "Leader", "leader-pending@example.com")
    invited = _make_user(db, "Invited", "invited@example.com")
    db.add(UserSkill(user_id=invited.id, skill_id=skill.id, proficiency_level="advanced"))

    team = Team(team_name="Team P", leader_id=leader.id)
    db.add(team)
    db.flush()

    db.add(
        TeamInvitation(
            team_id=team.id, invited_user_id=invited.id, invited_by=leader.id, proposed_role_id=role.id
        )
    )
    db.flush()

    suggestions = service.generate_match_suggestions(db, team.id, [skill.id], count=5)

    assert all(s.suggested_user_id != invited.id for s in suggestions)


def test_never_returns_more_than_five_suggestions(db):
    role = Role(role_name="Backend Developer")
    skill = Skill(name="FastAPI", category="Backend")
    db.add_all([role, skill])
    db.flush()

    leader = _make_user(db, "Leader", "leader-cap@example.com")
    for i in range(8):
        candidate = _make_user(db, f"Candidate {i}", f"candidate{i}@example.com")
        db.add(UserSkill(user_id=candidate.id, skill_id=skill.id, proficiency_level="advanced"))

    team = Team(team_name="Team Cap", leader_id=leader.id)
    db.add(team)
    db.flush()

    suggestions = service.generate_match_suggestions(db, team.id, [skill.id], count=50)

    assert len(suggestions) == service.MAX_SUGGESTIONS


def test_generate_match_suggestions_raises_for_unknown_team(db):
    with pytest.raises(ValueError):
        service.generate_match_suggestions(db, uuid.uuid4(), [], count=5)


def _idea(title, description="desc", difficulty="intermediate", technologies=None, confidence=0.9):
    from ai.schemas import ProjectIdea

    return ProjectIdea(
        title=title,
        description=description,
        difficulty_level=difficulty,
        required_technologies=technologies if technologies is not None else ["React", "FastAPI"],
        confidence_score=confidence,
    )


def test_generate_project_recommendations_persists_llm_output(db, monkeypatch):
    leader = _make_user(db, "Leader", "leader-recs@example.com")
    leader.experience_level = "advanced"
    skill = Skill(name="FastAPI", category="Backend")
    db.add(skill)
    db.flush()
    db.add(UserSkill(user_id=leader.id, skill_id=skill.id, proficiency_level="advanced"))

    team = Team(team_name="Team R", leader_id=leader.id)
    db.add(team)
    db.flush()

    captured = {}

    def fake_generate(skills, interests, experience_levels=None, count=5):
        captured["skills"] = skills
        captured["experience_levels"] = experience_levels
        captured["count"] = count
        return [_idea("Budget Tracker", technologies=["FastAPI", "PostgreSQL"], difficulty="advanced")]

    monkeypatch.setattr(service.recommendations, "generate_project_ideas", fake_generate)

    recs = service.generate_project_recommendations(db, team.id)

    assert len(recs) == 1
    assert recs[0].title == "Budget Tracker"
    assert recs[0].difficulty_level == "advanced"
    assert recs[0].required_technologies == ["FastAPI", "PostgreSQL"]
    assert "FastAPI" in captured["skills"]  # leader's skills reach the prompt
    assert captured["experience_levels"] == ["advanced"]  # experience feeds the prompt
    assert captured["count"] == 5  # sprint requirement: 5 ideas by default


def test_generate_project_recommendations_replaces_previous_results(db, monkeypatch):
    from models import ProjectRecommendation

    leader = _make_user(db, "Leader", "leader-recs2@example.com")
    team = Team(team_name="Team R2", leader_id=leader.id)
    db.add(team)
    db.flush()

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [_idea("Idea A")],
    )
    service.generate_project_recommendations(db, team.id)

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [_idea("Idea B")],
    )
    service.generate_project_recommendations(db, team.id)

    rows = db.query(ProjectRecommendation).filter_by(team_id=team.id).all()
    assert [row.title for row in rows] == ["Idea B"]


def test_invalid_difficulty_from_llm_is_rejected(db):
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        _idea("Bad Idea", difficulty="impossible")


def test_empty_technologies_from_llm_is_rejected(db):
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        _idea("Bad Idea", technologies=[])


def test_overlong_title_from_llm_is_rejected(db):
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        _idea("X" * 300)  # DB column is String(255)


def test_malformed_llm_envelope_is_rejected(db):
    import pydantic

    from ai.schemas import ProjectIdeaList

    with pytest.raises(pydantic.ValidationError):
        ProjectIdeaList.model_validate_json('{"ideas": []}')  # wrong key
    with pytest.raises(pydantic.ValidationError):
        ProjectIdeaList.model_validate_json('["just", "a", "list"]')  # wrong shape


def test_accepted_recommendation_survives_regeneration(db, monkeypatch):
    from models import Project, ProjectRecommendation

    leader = _make_user(db, "Leader", "leader-accepted@example.com")
    team = Team(team_name="Team Accepted", leader_id=leader.id)
    db.add(team)
    db.flush()

    accepted = ProjectRecommendation(
        team_id=team.id, title="Chosen One", description="the accepted idea", confidence_score=0.9
    )
    db.add(accepted)
    db.flush()
    db.add(Project(team_id=team.id, recommendation_id=accepted.id, title="Chosen One", description="d"))
    db.flush()

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [_idea("Fresh Idea")],
    )

    # Before the fix this raised IntegrityError: the bulk delete violated
    # projects.recommendation_id's NOT NULL foreign key.
    recs = service.generate_project_recommendations(db, team.id)

    titles = {r.title for r in db.query(ProjectRecommendation).filter_by(team_id=team.id)}
    assert "Chosen One" in titles  # the accepted one survives
    assert "Fresh Idea" in titles  # the new ones arrive
    assert [r.title for r in recs] == ["Fresh Idea"]


def test_excess_ideas_from_llm_are_capped(db, monkeypatch):
    leader = _make_user(db, "Leader", "leader-cap2@example.com")
    team = Team(team_name="Team Cap2", leader_id=leader.id)
    db.add(team)
    db.flush()

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [_idea(f"Idea {i}") for i in range(12)],
    )

    recs = service.generate_project_recommendations(db, team.id, count=50)

    assert len(recs) == service.MAX_RECOMMENDATIONS


def test_empty_llm_answer_keeps_previous_recommendations(db, monkeypatch):
    from models import ProjectRecommendation

    leader = _make_user(db, "Leader", "leader-empty@example.com")
    team = Team(team_name="Team Empty", leader_id=leader.id)
    db.add(team)
    db.flush()

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [_idea("Existing Idea")],
    )
    service.generate_project_recommendations(db, team.id)

    monkeypatch.setattr(
        service.recommendations,
        "generate_project_ideas",
        lambda skills, interests, experience_levels=None, count=5: [],
    )
    with pytest.raises(RuntimeError):
        service.generate_project_recommendations(db, team.id)

    titles = [r.title for r in db.query(ProjectRecommendation).filter_by(team_id=team.id)]
    assert titles == ["Existing Idea"]  # cache untouched by the failed run


def test_generate_project_recommendations_raises_for_unknown_team(db):
    with pytest.raises(ValueError):
        service.generate_project_recommendations(db, uuid.uuid4())
