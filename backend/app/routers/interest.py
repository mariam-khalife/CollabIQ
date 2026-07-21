from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.interest import UserInterestCreate, UserInterestResponse
from app.services.interest_service import (
    add_user_interest,
    get_user_interests,
    remove_user_interest,
)

router = APIRouter(
    prefix="/users",
    tags=["Interests"]
)


@router.get(
    "/{user_id}/interests",
    response_model=list[UserInterestResponse]
)
def list_user_interests(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    return get_user_interests(db, user_id)


@router.post(
    "/{user_id}/interests",
    response_model=UserInterestResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user_interest(
    user_id: UUID,
    interest_data: UserInterestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only add interests to your own profile"
        )

    result = add_user_interest(db, user_id, interest_data)

    if result == "interest_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interest not found"
        )

    if result == "duplicate":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Interest already added"
        )

    return result


@router.delete("/{user_id}/interests/{interest_id}")
def delete_user_interest(
    user_id: UUID,
    interest_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only remove interests from your own profile"
        )

    removed = remove_user_interest(
        db,
        user_id,
        interest_id
    )

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User interest not found"
        )

    return {
        "message": "Interest removed successfully"
    }