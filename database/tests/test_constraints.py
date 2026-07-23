import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models import Role, Team, TeamInvitation, TeamMember, User  # noqa: E402

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


def _make_team_with_member(db):
    leader = User(full_name="Leader", email="leader@example.com", password_hash="x")
    member = User(full_name="Member", email="member@example.com", password_hash="x")
    role = Role(role_name="Backend Developer")
    db.add_all([leader, member, role])
    db.flush()

    team = Team(team_name="Team X", leader_id=leader.id)
    db.add(team)
    db.flush()

    invitation = TeamInvitation(
        team_id=team.id, invited_user_id=member.id, invited_by=leader.id, proposed_role_id=role.id
    )
    db.add(invitation)
    db.flush()
    db.add(TeamMember(team_id=team.id, user_id=member.id, role_id=role.id, invitation_id=invitation.id))
    db.commit()
    return team, member, leader, role


def test_defaults_are_applied(db):
    team, _, _, _ = _make_team_with_member(db)

    assert team.status == "forming"
    assert team.readiness_score == 0.0


def test_cannot_add_same_user_to_team_twice(db):
    team, member, leader, role = _make_team_with_member(db)

    duplicate_invitation = TeamInvitation(
        team_id=team.id, invited_user_id=member.id, invited_by=leader.id, proposed_role_id=role.id, status="accepted"
    )
    db.add(duplicate_invitation)
    db.flush()

    db.add(TeamMember(team_id=team.id, user_id=member.id, role_id=role.id, invitation_id=duplicate_invitation.id))
    with pytest.raises(IntegrityError):
        db.commit()


def test_cannot_send_two_pending_invitations_to_same_user(db):
    team, member, leader, role = _make_team_with_member(db)

    db.add(TeamInvitation(team_id=team.id, invited_user_id=member.id, invited_by=leader.id, proposed_role_id=role.id))
    with pytest.raises(IntegrityError):
        db.commit()


def test_can_reinvite_after_decline(db):
    team, member, leader, role = _make_team_with_member(db)
    db.query(TeamInvitation).filter_by(team_id=team.id, invited_user_id=member.id).update({"status": "declined"})
    db.commit()

    db.add(TeamInvitation(team_id=team.id, invited_user_id=member.id, invited_by=leader.id, proposed_role_id=role.id))
    db.commit()  # should not raise - previous invitation is no longer pending


def test_invalid_team_status_is_rejected(db):
    leader = User(full_name="Leader", email="leader2@example.com", password_hash="x")
    db.add(leader)
    db.flush()

    db.add(Team(team_name="Bad Team", leader_id=leader.id, status="not_a_real_status"))
    with pytest.raises(IntegrityError):
        db.commit()


def test_invalid_availability_is_rejected(db):
    db.add(User(full_name="Bad", email="bad@example.com", password_hash="x", availability="whenever"))
    with pytest.raises(IntegrityError):
        db.commit()
