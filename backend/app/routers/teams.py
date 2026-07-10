from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.team import TeamCreate, TeamResponse, TeamMemberResponse
from app.schemas.invitation import InvitationCreate, InvitationResponse
from app.services.invitation_service import create_invitation
from app.services.team_service import create_team, get_team_by_id, get_team_members

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_new_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_team(db, team_data, current_user)


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: UUID,
    db: Session = Depends(get_db)
):
    team = get_team_by_id(db, team_id)


    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    return team

@router.get("/{team_id}/members", response_model=list[TeamMemberResponse])
def get_members(
    team_id: UUID,
    db: Session = Depends(get_db)
):
    team = get_team_by_id(db, team_id)

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    return get_team_members(db, team_id)

@router.post("/{team_id}/invitations", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
def invite_user_to_team(
    team_id: UUID,
    invitation_data: InvitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = create_invitation(db, team_id, invitation_data, current_user)

    if result == "team_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can send invitations"
        )

    if result == "duplicate":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pending invitation already exists for this user"
        )

    return result