from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.skill import UserSkillCreate, UserSkillResponse
from app.services.skill_service import (
    add_user_skill,
    get_user_skills,
    remove_user_skill,
)

router = APIRouter(
    prefix="/users",
    tags=["Skills"]
)


@router.get("/{user_id}/skills", response_model=list[UserSkillResponse])
def list_user_skills(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    return get_user_skills(db, user_id)


@router.post(
    "/{user_id}/skills",
    response_model=UserSkillResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user_skill(
    user_id: UUID,
    skill_data: UserSkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only add skills to your own profile"
        )

    result = add_user_skill(db, user_id, skill_data)

    if result == "skill_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    if result == "duplicate":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Skill already added"
        )

    return result


@router.delete("/{user_id}/skills/{skill_id}")
def delete_user_skill(
    user_id: UUID,
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only remove skills from your own profile"
        )

    removed = remove_user_skill(db, user_id, skill_id)

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User skill not found"
        )

    return {"message": "Skill removed successfully"}