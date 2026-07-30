from datetime import date, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.task import Task
from app.models.user import User


def create_notification(
    db: Session,
    user_id: UUID,
    type: str,
    title: str,
    message: str,
    related_id: UUID | None = None,
    action_url: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
        related_id=related_id,
        action_url=action_url,
    )

    db.add(notification)
    db.flush()
    db.refresh(notification)

    return notification


def create_deadline_reminders(
    db: Session,
    current_user: User,
) -> int:
    """
    Create one deadline reminder for each unfinished task
    assigned to the current user and due today or tomorrow.

    Existing reminders are not duplicated.
    """
    today = date.today()
    tomorrow = today + timedelta(days=1)

    tasks = (
        db.query(Task)
        .filter(
            Task.assigned_to == current_user.id,
            Task.status != "done",
            Task.deadline.isnot(None),
            Task.deadline <= tomorrow,
        )
        .all()
    )

    created_count = 0

    for task in tasks:
        existing_reminder = (
            db.query(Notification)
            .filter(
                Notification.user_id == current_user.id,
                Notification.type == "deadline_reminder",
                Notification.related_id == task.id,
            )
            .first()
        )

        if existing_reminder:
            continue

        if task.deadline < today:
            title = "Task Deadline Overdue"
            message = (
                f'The task "{task.title}" was due on '
                f"{task.deadline.strftime('%b %d, %Y')}."
            )
        elif task.deadline == today:
            title = "Task Due Today"
            message = (
                f'The task "{task.title}" is due today.'
            )
        else:
            title = "Task Due Tomorrow"
            message = (
                f'The task "{task.title}" is due tomorrow.'
            )

        create_notification(
            db=db,
            user_id=current_user.id,
            type="deadline_reminder",
            title=title,
            message=message,
            related_id=task.id,
            action_url="/my-projects",
        )

        created_count += 1

    if created_count > 0:
        db.commit()

    return created_count


def get_notifications(
    db: Session,
    current_user: User,
    type: str | None = None,
    unread: bool | None = None,
) -> list[Notification]:
    create_deadline_reminders(
        db,
        current_user,
    )

    query = db.query(Notification).filter(
        Notification.user_id == current_user.id
    )

    if type is not None:
        query = query.filter(
            Notification.type == type
        )

    if unread is True:
        query = query.filter(
            Notification.is_read == False  # noqa: E712
        )
    elif unread is False:
        query = query.filter(
            Notification.is_read == True  # noqa: E712
        )

    return (
        query.order_by(
            Notification.is_read.asc(),
            Notification.created_at.desc(),
        )
        .all()
    )


def mark_as_read(
    db: Session,
    current_user: User,
    notification_id: UUID,
) -> Notification | None:
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )

    if not notification:
        return None

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def mark_all_as_read(
    db: Session,
    current_user: User,
) -> int:
    updated = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,  # noqa: E712
        )
        .update({"is_read": True})
    )

    db.commit()

    return updated


def get_unread_count(
    db: Session,
    current_user: User,
) -> int:
    create_deadline_reminders(
        db,
        current_user,
    )

    return (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,  # noqa: E712
        )
        .count()
    )