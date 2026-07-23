from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.reputation import ReputationSummaryResponse
from app.services.reputation_service import get_user_reputation_summary


router = APIRouter(
    prefix="/reputation",
    tags=["Reputation"],
)


@router.get(
    "/me",
    response_model=ReputationSummaryResponse,
)
def get_my_reputation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_reputation_summary(
        db,
        current_user.id,
    )


@router.get(
    "/users/{user_id}",
    response_model=ReputationSummaryResponse,
)
def get_user_reputation(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return get_user_reputation_summary(
        db,
        user_id,
    )