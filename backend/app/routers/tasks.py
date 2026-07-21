from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskStatusUpdate,
    TaskUpdate
)
from app.services.task_service import (
    create_task,
    delete_task,
    get_project_tasks,
    get_task_by_id,
    get_user_tasks,
    update_task,
    update_task_status
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = create_task(db, task_data, current_user)

    if result == "phase_not_found":
        raise HTTPException(404, "Roadmap phase not found")

    if result == "not_leader":
        raise HTTPException(403, "Only the team leader can create tasks")

    if result == "not_team_member":
        raise HTTPException(
            400,
            "The assigned user is not a member of this team"
        )

    return result


@router.get(
    "/project/{project_id}",
    response_model=list[TaskResponse]
)
def list_project_tasks(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    return get_project_tasks(db, project_id)


@router.get(
    "/user/{user_id}",
    response_model=list[TaskResponse]
)
def list_user_tasks(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only view your own tasks"
        )

    return get_user_tasks(db, user_id)


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db)
):
    task = get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(404, "Task not found")

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_existing_task(
    task_id: UUID,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(404, "Task not found")

    result = update_task(db, task, task_data, current_user)

    if result == "not_leader":
        raise HTTPException(403, "Only the team leader can edit tasks")

    if result == "invalid_status":
        raise HTTPException(400, "Invalid task status")

    return result


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse
)
def change_task_status(
    task_id: UUID,
    status_data: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(404, "Task not found")

    result = update_task_status(
        db,
        task,
        status_data.status,
        current_user
    )

    if result == "invalid_status":
        raise HTTPException(
            400,
            "Status must be todo, in_progress, or completed"
        )

    if result == "not_allowed":
        raise HTTPException(
            403,
            "Only the assigned member or team leader can update this task"
        )

    return result


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(404, "Task not found")

    if not delete_task(db, task, current_user):
        raise HTTPException(403, "Only the team leader can delete tasks")