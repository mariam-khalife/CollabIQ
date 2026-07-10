from sqlalchemy.orm import Session
from uuid import UUID

from app.models.invitation import TeamInvitation
from app.models.team import Team
from app.models.user import User
from app.schemas.invitation import InvitationCreate


def create_invitation(
    db: Session,
    team_id: UUID,
    invitation_data: InvitationCreate,
    current_user: User
):
    team = db.query(Team).filter(Team.id == team_id).first()

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    existing_invitation = db.query(TeamInvitation).filter(
        TeamInvitation.team_id == team_id,
        TeamInvitation.invited_user_id == invitation_data.invited_user_id,
        TeamInvitation.status == "pending"
    ).first()

    if existing_invitation:
        return "duplicate"

    invitation = TeamInvitation(
        team_id=team_id,
        invited_user_id=invitation_data.invited_user_id,
        invited_by=current_user.id,
        proposed_role_id=invitation_data.proposed_role_id,
        status="pending"
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    return invitation