from uuid import UUID

from sqlalchemy.orm import Session

from app.models.team import Role, Team, TeamMember
from app.models.user import User
from app.schemas.team import TeamCreate


def create_team(
    db: Session,
    team_data: TeamCreate,
    current_user: User,
):
    new_team = Team(
        team_name=team_data.team_name,
        leader_id=current_user.id,
        readiness_score=0,
        status="forming",
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    return new_team


def get_team_by_id(
    db: Session,
    team_id: UUID,
):
    return (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )


def get_user_led_teams(
    db: Session,
    user_id: UUID,
):
    return (
        db.query(Team)
        .filter(Team.leader_id == user_id)
        .all()
    )


def get_user_teams(
    db: Session,
    user_id: UUID,
):
    led_teams = (
        db.query(Team)
        .filter(Team.leader_id == user_id)
        .all()
    )

    joined_team_ids = [
        member.team_id
        for member in (
            db.query(TeamMember)
            .filter(TeamMember.user_id == user_id)
            .all()
        )
    ]

    joined_teams = []

    if joined_team_ids:
        joined_teams = (
            db.query(Team)
            .filter(Team.id.in_(joined_team_ids))
            .all()
        )

    teams_by_id = {
        team.id: team
        for team in led_teams + joined_teams
    }

    return list(teams_by_id.values())


def get_team_members(
    db: Session,
    team_id: UUID,
):
    members = (
        db.query(
            TeamMember.id,
            TeamMember.user_id,
            User.full_name,
            User.email,
            TeamMember.role_id,
            Role.role_name,
            TeamMember.has_committed,
            TeamMember.joined_at,
        )
        .join(
            User,
            User.id == TeamMember.user_id,
        )
        .join(
            Role,
            Role.id == TeamMember.role_id,
        )
        .filter(TeamMember.team_id == team_id)
        .all()
    )

    return [
        {
            "id": member.id,
            "user_id": member.user_id,
            "full_name": member.full_name,
            "email": member.email,
            "role_id": member.role_id,
            "role_name": member.role_name,
            "has_committed": member.has_committed,
            "joined_at": member.joined_at,
        }
        for member in members
    ]


def remove_team_member(
    db: Session,
    team_id: UUID,
    user_id: UUID,
    current_user: User,
):
    team = get_team_by_id(db, team_id)

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    if user_id == team.leader_id:
        return "cannot_remove_leader"

    member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id,
        )
        .first()
    )

    if not member:
        return "member_not_found"

    db.delete(member)
    db.commit()

    return "removed"


def calculate_team_readiness(
    db: Session,
    team_id: UUID,
):
    team = get_team_by_id(db, team_id)

    if not team:
        return None

    members = get_team_members(db, team_id)

    # Include the team leader in the displayed count.
    member_count = len(members) + 1

    committed_members = [
        member
        for member in members
        if member.get("has_committed") is True
    ]

    committed_count = len(committed_members)

    # Team leader contributes 20 points.
    score = 20

    # Accepted members contribute up to 40 points.
    score += min(len(members) * 20, 40)

    # Committed members contribute up to 40 points.
    score += min(committed_count * 20, 40)

    score = min(score, 100)

    if score >= 90:
        label = "Excellent"
    elif score >= 75:
        label = "Good"
    elif score >= 60:
        label = "Fair"
    elif score >= 40:
        label = "Developing"
    else:
        label = "Needs Work"

    team.readiness_score = score

    db.commit()
    db.refresh(team)

    return {
        "team_id": team.id,
        "readiness_score": score,
        "label": label,
        "member_count": member_count,
        "committed_member_count": committed_count,
    }