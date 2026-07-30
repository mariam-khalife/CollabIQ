from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.roadmap import (
    RoadmapCreate,
    RoadmapPhaseCreate,
    RoadmapPhaseResponse,
    RoadmapPhaseStatusUpdate,
    RoadmapPhaseUpdate,
    RoadmapProgressResponse,
    RoadmapResponse,
)
from app.services.roadmap_service import (
    add_phase_to_roadmap,
    calculate_roadmap_progress,
    create_roadmap,
    delete_phase,
    get_roadmap_by_project,
    update_phase,
    update_phase_status,
)


router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"],
)


def handle_phase_error(
    result,
    leader_message: str,
):
    if result == "phase_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap phase not found",
        )

    if result == "roadmap_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found",
        )

    if result == "project_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=leader_message,
        )

    if result == "duplicate_phase_order":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Another phase already uses this "
                "phase order"
            ),
        )


@router.post(
    "/",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_roadmap(
    roadmap_data: RoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = create_roadmap(
        db,
        roadmap_data,
        current_user,
    )

    if result == "project_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only the team leader can "
                "create the roadmap"
            ),
        )

    if result == "roadmap_exists":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This project already has "
                "a roadmap"
            ),
        )

    if result == "duplicate_phase_order":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Roadmap phases must have "
                "unique order values"
            ),
        )

    return get_roadmap_by_project(
        db,
        roadmap_data.project_id,
    )


@router.get(
    "/project/{project_id}",
    response_model=RoadmapResponse,
)
def get_project_roadmap(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    roadmap = get_roadmap_by_project(
        db,
        project_id,
    )

    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found",
        )

    return roadmap


@router.post(
    "/{roadmap_id}/phases",
    response_model=RoadmapPhaseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_roadmap_phase(
    roadmap_id: UUID,
    phase_data: RoadmapPhaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = add_phase_to_roadmap(
        db,
        roadmap_id,
        phase_data,
        current_user,
    )

    handle_phase_error(
        result,
        "Only the team leader can add roadmap phases",
    )

    return result


@router.put(
    "/phases/{phase_id}",
    response_model=RoadmapPhaseResponse,
)
def edit_roadmap_phase(
    phase_id: UUID,
    phase_data: RoadmapPhaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = update_phase(
        db,
        phase_id,
        phase_data,
        current_user,
    )

    handle_phase_error(
        result,
        "Only the team leader can edit roadmap phases",
    )

    return result


@router.patch(
    "/phases/{phase_id}/status",
    response_model=RoadmapPhaseResponse,
)
def change_phase_status(
    phase_id: UUID,
    phase_data: RoadmapPhaseStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = update_phase_status(
        db,
        phase_id,
        phase_data,
        current_user,
    )

    handle_phase_error(
        result,
        (
            "Only the team leader can "
            "update phase status"
        ),
    )

    return result


@router.delete(
    "/phases/{phase_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_roadmap_phase(
    phase_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = delete_phase(
        db,
        phase_id,
        current_user,
    )

    handle_phase_error(
        result,
        "Only the team leader can delete roadmap phases",
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


@router.get(
    "/{roadmap_id}/progress",
    response_model=RoadmapProgressResponse,
)
def get_roadmap_progress(
    roadmap_id: UUID,
    db: Session = Depends(get_db),
):
    progress = calculate_roadmap_progress(
        db,
        roadmap_id,
    )

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found",
        )

    return progress