from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.roadmap import Roadmap, RoadmapPhase
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.reputation_service import add_reputation_event
from app.services import notification_service


ALLOWED_STATUSES = {"todo", "in_progress", "done"}


def get_phase_team(db: Session, phase_id: UUID):
    return (
        db.query(Team)
        .join(Project, Project.team_id == Team.id)
        .join(Roadmap, Roadmap.project_id == Project.id)
        .join(RoadmapPhase, RoadmapPhase.roadmap_id == Roadmap.id)
        .filter(RoadmapPhase.id == phase_id)
        .first()
    )


def create_task(
    db: Session,
    task_data: TaskCreate,
    current_user: User
):
    team = get_phase_team(db, task_data.phase_id)

    if not team:
        return "phase_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    if task_data.assigned_to:
        member = db.query(TeamMember).filter(
            TeamMember.team_id == team.id,
            TeamMember.user_id == task_data.assigned_to
        ).first()

        if not member and task_data.assigned_to != team.leader_id:
            return "not_team_member"

    task = Task(
        phase_id=task_data.phase_id,
        assigned_to=task_data.assigned_to,
        title=task_data.title,
        description=task_data.description,
        deadline=task_data.deadline,
        status="todo"
    )

    try:
        db.add(task)
        db.flush()

        if task.assigned_to:
            notification_service.create_notification(
                db,
                user_id=task.assigned_to,
                type="task_assignment",
                title="New Task Assigned",
                message=f'You were assigned the task "{task.title}".',
                related_id=task.id,
                action_url=f"/tasks/{task.id}",
            )

        db.commit()
        db.refresh(task)

        return task

    except Exception:
        db.rollback()
        raise


def get_task_by_id(db: Session, task_id: UUID):
    return db.query(Task).filter(Task.id == task_id).first()


def get_project_tasks(db: Session, project_id: UUID):
    return (
        db.query(Task)
        .join(RoadmapPhase, Task.phase_id == RoadmapPhase.id)
        .join(Roadmap, RoadmapPhase.roadmap_id == Roadmap.id)
        .filter(Roadmap.project_id == project_id)
        .order_by(RoadmapPhase.phase_order, Task.created_at)
        .all()
    )


def get_user_tasks(db: Session, user_id: UUID):
    return db.query(Task).filter(
        Task.assigned_to == user_id
    ).order_by(Task.deadline).all()


def update_task(
    db: Session,
    task: Task,
    task_data: TaskUpdate,
    current_user: User
):
    team = get_phase_team(db, task.phase_id)

    if not team or team.leader_id != current_user.id:
        return "not_leader"

    update_data = task_data.model_dump(exclude_unset=True)

    if "status" in update_data:
        if update_data["status"] not in ALLOWED_STATUSES:
            return "invalid_status"

    old_status = task.status
    old_assigned_to = task.assigned_to

    for field, value in update_data.items():
        setattr(task, field, value)

    if (
        task.assigned_to
        and task.assigned_to != old_assigned_to
    ):
        notification_service.create_notification(
            db,
            user_id=task.assigned_to,
            type="task_assignment",
            title="Task Assigned",
            message=f'You were assigned the task "{task.title}".',
            related_id=task.id,
            action_url=f"/tasks/{task.id}",
        )

    if (
        old_status != "done"
        and task.status == "done"
        and task.assigned_to
    ):
        add_reputation_event(
            db,
            task.assigned_to,
            "task_completed",
        )

    db.commit()
    db.refresh(task)

    return task


def update_task_status(
    db: Session,
    task: Task,
    new_status: str,
    current_user: User
):
    if new_status not in ALLOWED_STATUSES:
        return "invalid_status"

    team = get_phase_team(db, task.phase_id)

    is_leader = team and team.leader_id == current_user.id
    is_assignee = task.assigned_to == current_user.id

    if not is_leader and not is_assignee:
        return "not_allowed"

    old_status = task.status
    task.status = new_status

    if (
        old_status != "done"
        and new_status == "done"
        and task.assigned_to
    ):
        add_reputation_event(
            db,
            task.assigned_to,
            "task_completed",
        )

    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task: Task,
    current_user: User
):
    team = get_phase_team(db, task.phase_id)

    if not team or team.leader_id != current_user.id:
        return False

    db.delete(task)
    db.commit()

    return True