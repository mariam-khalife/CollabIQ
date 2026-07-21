from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.roadmap import RoadmapCreate, RoadmapResponse
from app.services.roadmap_service import (
    create_roadmap,
    get_roadmap_by_project,
)

router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"]
)


@router.post(
    "/",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_roadmap(
    roadmap_data: RoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = create_roadmap(
        db,
        roadmap_data,
        current_user
    )

    if result == "project_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can create the roadmap"
        )

    if result == "roadmap_exists":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This project already has a roadmap"
        )

    return get_roadmap_by_project(
        db,
        roadmap_data.project_id
    )


@router.get(
    "/project/{project_id}",
    response_model=RoadmapResponse
)
def get_project_roadmap(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    roadmap = get_roadmap_by_project(db, project_id)

    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    return roadmap