from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database import get_db
from app.models.user import User
from app.schemas.team import TeamResponse
from app.schemas.user import (
    PublicUserResponse,
    UserResponse,
    UserSearchResponse,
    UserUpdate,
)
from app.services.team_service import get_user_teams


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    try:
        parsed_user_id = UUID(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token user ID",
        )

    user = db.query(User).filter(User.id == parsed_user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.get("/search", response_model=list[UserSearchResponse])
def search_users(
    query: str = Query(min_length=2, max_length=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cleaned_query = query.strip()

    if len(cleaned_query) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must contain at least 2 characters",
        )

    search_value = f"%{cleaned_query}%"

    return (
        db.query(User)
        .filter(
            User.id != current_user.id,
            or_(
                User.full_name.ilike(search_value),
                User.email.ilike(search_value),
            ),
        )
        .order_by(User.full_name.asc())
        .limit(10)
        .all()
    )


@router.get(
    "/{user_id}/teams",
    response_model=list[TeamResponse],
)
def list_user_teams(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own teams",
        )

    return get_user_teams(db, user_id)


@router.get("/{user_id}", response_model=PublicUserResponse)
def get_user_by_id(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user