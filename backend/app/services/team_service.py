from sqlalchemy.orm import Session

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

def get_team_members(db: Session, team_id):
    return db.query(TeamMember).filter(TeamMember.team_id == team_id).all()