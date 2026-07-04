import sys
import uuid
from pathlib import Path

import pytest
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

DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/collabiq"


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


def test_generate_match_suggestions_raises_for_unknown_team(db):
    with pytest.raises(ValueError):
        service.generate_match_suggestions(db, uuid.uuid4(), [], count=5)
