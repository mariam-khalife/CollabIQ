from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session, aliased

from app.models.invitation import TeamInvitation
from app.models.team import Role, Team, TeamMember
from app.models.user import User
from app.schemas.invitation import InvitationCreate
from app.services import notification_service
from app.services.reputation_service import add_reputation_event


def create_invitation(
    db: Session,
    team_id: UUID,
    invitation_data: InvitationCreate,
    current_user: User,
):
    """
    Create a new pending invitation.

    Only the team leader can invite users.
    """

    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    invited_user = (
        db.query(User)
        .filter(
            User.id
            == invitation_data.invited_user_id
        )
        .first()
    )

    if not invited_user:
        return "user_not_found"

    role = (
        db.query(Role)
        .filter(
            Role.id
            == invitation_data.proposed_role_id
        )
        .first()
    )

    if not role:
        return "role_not_found"

    # The team leader is already a member.
    if invited_user.id == team.leader_id:
        return "already_member"

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == invited_user.id,
        )
        .first()
    )

    if existing_member:
        return "already_member"

    existing_pending_invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.team_id == team_id,
            TeamInvitation.invited_user_id
            == invited_user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if existing_pending_invitation:
        return "duplicate"

    invitation = TeamInvitation(
        team_id=team_id,
        invited_user_id=invited_user.id,
        invited_by=current_user.id,
        proposed_role_id=role.id,
        status="pending",
    )

    try:
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
    except Exception:
        db.rollback()
        raise

    notification_service.create_notification(
        db,
        user_id=invitation.invited_user_id,
        type="invitation",
        title="Team Invitation",
        message=(
            f"{current_user.full_name} invited you "
            f"to join {team.team_name}."
        ),
        related_id=invitation.id,
        action_url="/invitations",
    )

    return invitation


def get_my_invitations(
    db: Session,
    user_id: UUID,
):
    """
    Return the pending invitations received by a user.
    """

    inviter = aliased(User)

    invitations = (
        db.query(
            TeamInvitation.id,
            TeamInvitation.team_id,
            Team.team_name,
            TeamInvitation.invited_by,
            inviter.full_name.label(
                "inviter_name"
            ),
            TeamInvitation.proposed_role_id,
            Role.role_name.label(
                "proposed_role_name"
            ),
            TeamInvitation.status,
            TeamInvitation.sent_at,
            TeamInvitation.responded_at,
        )
        .join(
            Team,
            Team.id == TeamInvitation.team_id,
        )
        .join(
            inviter,
            inviter.id
            == TeamInvitation.invited_by,
        )
        .join(
            Role,
            Role.id
            == TeamInvitation.proposed_role_id,
        )
        .filter(
            TeamInvitation.invited_user_id
            == user_id,
            TeamInvitation.status == "pending",
        )
        .order_by(
            TeamInvitation.sent_at.desc()
        )
        .all()
    )

    return [
        {
            "id": invitation.id,
            "team_id": invitation.team_id,
            "team_name": invitation.team_name,
            "invited_by": invitation.invited_by,
            "inviter_name": invitation.inviter_name,
            "proposed_role_id": (
                invitation.proposed_role_id
            ),
            "proposed_role_name": (
                invitation.proposed_role_name
            ),
            "status": invitation.status,
            "sent_at": invitation.sent_at,
            "responded_at": (
                invitation.responded_at
            ),
        }
        for invitation in invitations
    ]


def get_team_invitations(
    db: Session,
    team_id: UUID,
    current_user: User,
):
    """
    Return all invitations sent for a team.

    Only the team leader can access this list.
    """

    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    invitations = (
        db.query(
            TeamInvitation.id,
            TeamInvitation.invited_user_id,
            User.full_name.label(
                "invited_user_name"
            ),
            User.email.label(
                "invited_user_email"
            ),
            TeamInvitation.proposed_role_id,
            Role.role_name.label(
                "proposed_role_name"
            ),
            TeamInvitation.status,
            TeamInvitation.sent_at,
            TeamInvitation.responded_at,
        )
        .join(
            User,
            User.id
            == TeamInvitation.invited_user_id,
        )
        .join(
            Role,
            Role.id
            == TeamInvitation.proposed_role_id,
        )
        .filter(
            TeamInvitation.team_id == team_id
        )
        .order_by(
            TeamInvitation.sent_at.desc()
        )
        .all()
    )

    return [
        {
            "id": invitation.id,
            "invited_user_id": (
                invitation.invited_user_id
            ),
            "invited_user_name": (
                invitation.invited_user_name
            ),
            "invited_user_email": (
                invitation.invited_user_email
            ),
            "proposed_role_id": (
                invitation.proposed_role_id
            ),
            "proposed_role_name": (
                invitation.proposed_role_name
            ),
            "status": invitation.status,
            "sent_at": invitation.sent_at,
            "responded_at": (
                invitation.responded_at
            ),
        }
        for invitation in invitations
    ]


def accept_invitation(
    db: Session,
    invitation_id: UUID,
    current_user: User,
):
    """
    Accept a pending invitation and add the user
    to the team as an active member.
    """

    invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.id == invitation_id
        )
        .first()
    )

    if not invitation:
        return "not_found"

    if (
        invitation.invited_user_id
        != current_user.id
    ):
        return "forbidden"

    if invitation.status != "pending":
        return "already_answered"

    team = (
        db.query(Team)
        .filter(
            Team.id == invitation.team_id
        )
        .first()
    )

    if not team:
        return "team_not_found"

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id
            == invitation.team_id,
            TeamMember.user_id
            == current_user.id,
        )
        .first()
    )

    if existing_member:
        return "already_member"

    member = TeamMember(
        team_id=invitation.team_id,
        user_id=current_user.id,
        role_id=invitation.proposed_role_id,
        invitation_id=invitation.id,

        # In CollabIQ, accepting the invitation means
        # the user has joined and confirmed participation.
        has_committed=True,
    )

    invitation.status = "accepted"
    invitation.responded_at = datetime.now(
        timezone.utc
    )

    try:
        db.add(member)

        add_reputation_event(
            db,
            current_user.id,
            "team_joined",
        )

        db.commit()
        db.refresh(invitation)
        db.refresh(member)
    except Exception:
        db.rollback()
        raise

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
            message=(
                f"{current_user.full_name} joined "
                f"{team.team_name}."
            ),
            related_id=team.id,
            action_url=f"/teams/{team.id}",
        )

    return invitation


def decline_invitation(
    db: Session,
    invitation_id: UUID,
    current_user: User,
):
    """
    Decline a pending invitation.
    """

    invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.id == invitation_id
        )
        .first()
    )

    if not invitation:
        return "not_found"

    if (
        invitation.invited_user_id
        != current_user.id
    ):
        return "forbidden"

    if invitation.status != "pending":
        return "already_answered"

    invitation.status = "declined"
    invitation.responded_at = datetime.now(
        timezone.utc
    )

    try:
        db.commit()
        db.refresh(invitation)
    except Exception:
        db.rollback()
        raise

    team = (
        db.query(Team)
        .filter(
            Team.id == invitation.team_id
        )
        .first()
    )

    if team:
        notification_service.create_notification(
            db,
            user_id=team.leader_id,
            type="team_update",
            title="Invitation Declined",
            message=(
                f"{current_user.full_name} declined "
                f"the invitation to join "
                f"{team.team_name}."
            ),
            related_id=team.id,
            action_url=f"/teams/{team.id}",
        )

    return invitation