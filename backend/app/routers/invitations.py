from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException, status

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.invitation import InvitationResponse
from app.services.invitation_service import get_my_invitations, accept_invitation, decline_invitation

router = APIRouter(
    prefix="/invitations",
    tags=["Invitations"]
)


@router.get("/me", response_model=list[InvitationResponse])
def my_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_invitations(db, current_user.id)

@router.put("/{invitation_id}/accept", response_model=InvitationResponse)
def accept_team_invitation(
    invitation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = accept_invitation(db, invitation_id, current_user)

    if result == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This invitation does not belong to you"
        )

    if result == "already_answered":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invitation has already been answered"
        )

    if result == "already_member":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a team member"
        )

    return result


@router.put("/{invitation_id}/decline", response_model=InvitationResponse)
def decline_team_invitation(
    invitation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = decline_invitation(db, invitation_id, current_user)

    if result == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found"
        )

    if result == "forbidden":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This invitation does not belong to you"
        )

    if result == "already_answered":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invitation has already been answered"
        )

    return result