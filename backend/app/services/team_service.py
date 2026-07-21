from sqlalchemy.orm import Session
from uuid import UUID


from app.models.team import Team
from app.schemas.team import TeamCreate
from app.models.team import TeamMember
from app.models.user import User


def create_team(db: Session, team_data: TeamCreate, current_user: User):
    new_team = Team(
        team_name=team_data.team_name,
        leader_id=current_user.id,
        readiness_score=0,
        status="forming"
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    return new_team


def get_team_by_id(db: Session, team_id):
    return db.query(Team).filter(Team.id == team_id).first()


def get_user_led_teams(db: Session, user_id):
    return db.query(Team).filter(Team.leader_id == user_id).all()

def get_user_teams(db: Session, user_id: UUID):
    led_teams = db.query(Team).filter(
        Team.leader_id == user_id
    ).all()

    joined_team_ids = [
        member.team_id
        for member in db.query(TeamMember).filter(
            TeamMember.user_id == user_id
        ).all()
    ]

    joined_teams = []

    if joined_team_ids:
        joined_teams = db.query(Team).filter(
            Team.id.in_(joined_team_ids)
        ).all()

    teams_by_id = {
        team.id: team
        for team in led_teams + joined_teams
    }

    return list(teams_by_id.values())

def get_team_members(db: Session, team_id):
    return db.query(TeamMember).filter(TeamMember.team_id == team_id).all()

def remove_team_member(
    db: Session,
    team_id: UUID,
    user_id: UUID,
    current_user: User
):
    team = get_team_by_id(db, team_id)

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    if user_id == team.leader_id:
        return "cannot_remove_leader"

    member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()

    if not member:
        return "member_not_found"

    db.delete(member)
    db.commit()

    return "removed"

def calculate_team_readiness(db: Session, team_id: UUID):
    team = get_team_by_id(db, team_id)

    if not team:
        return None

    members = get_team_members(db, team_id)

    member_count = len(members)

    if member_count == 0:
        score = 0
    elif member_count == 1:
        score = 40
    elif member_count == 2:
        score = 60
    elif member_count == 3:
        score = 75
    else:
        score = 90

    if score >= 90:
        label = "Excellent"
    elif score >= 75:
        label = "Good"
    elif score >= 60:
        label = "Fair"
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
    }