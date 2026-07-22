from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone

from app.models.team import TeamMember
from app.models.invitation import TeamInvitation
from app.models.team import Team
from app.models.user import User
from app.schemas.invitation import InvitationCreate
from app.services import notification_service
from app.services.reputation_service import add_reputation_event


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

    notification_service.create_notification(
        db,
        user_id=invitation.invited_user_id,
        type="invitation",
        title="Team Invitation",
        message=f"You were invited to join {team.team_name}.",
        related_id=invitation.id,
        action_url="/invitations",
    )

    return invitation

def get_my_invitations(db: Session, user_id):
    return db.query(TeamInvitation).filter(
        TeamInvitation.invited_user_id == user_id,
        TeamInvitation.status == "pending"
    ).all()

def accept_invitation(
    db: Session,
    invitation_id: UUID,
    current_user: User
):
    invitation = db.query(TeamInvitation).filter(
        TeamInvitation.id == invitation_id
    ).first()

    if not invitation:
        return "not_found"

    if invitation.invited_user_id != current_user.id:
        return "forbidden"

    if invitation.status != "pending":
        return "already_answered"

    existing_member = db.query(TeamMember).filter(
        TeamMember.team_id == invitation.team_id,
        TeamMember.user_id == current_user.id
    ).first()

    if existing_member:
        return "already_member"

    member = TeamMember(
        team_id=invitation.team_id,
        user_id=current_user.id,
        role_id=invitation.proposed_role_id,
        invitation_id=invitation.id,
        has_committed=False
    )

    invitation.status = "accepted"
    invitation.responded_at = datetime.now(timezone.utc)

    db.add(member)
    
    add_reputation_event(
        db,
        current_user.id,
        "team_joined",
    )
    
    db.commit()
    db.refresh(invitation)
    db.refresh(member)
    
    team = db.query(Team).filter(Team.id == invitation.team_id).first()

    notification_service.create_notification(
        db,
        user_id=current_user.id,
        type="team_update",
        title="Joined Team",
        message=f"You joined {team.team_name}.",
        related_id=team.id,
        action_url=f"/teams/{team.id}",
    )

    if team.leader_id != current_user.id:
        notification_service.create_notification(
            db,
            user_id=team.leader_id,
            type="team_update",
            title="New Team Member",
            message=f"A new member joined {team.team_name}.",
            related_id=team.id,
            action_url=f"/teams/{team.id}",
        )

    return invitation


def decline_invitation(
    db: Session,
    invitation_id: UUID,
    current_user: User
):
    invitation = db.query(TeamInvitation).filter(
        TeamInvitation.id == invitation_id
    ).first()

    if not invitation:
        return "not_found"

    if invitation.invited_user_id != current_user.id:
        return "forbidden"

    if invitation.status != "pending":
        return "already_answered"

    invitation.status = "declined"
    invitation.responded_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(invitation)

    return invitation