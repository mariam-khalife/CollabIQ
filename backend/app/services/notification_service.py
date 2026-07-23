from uuid import UUID

from sqlalchemy.orm import Session

from app.models.notification import Notification
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
    """Call this from any other service when a notifiable event happens
    (invitation sent, task assigned, deadline approaching, etc.)."""
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


def get_notifications(
    db: Session,
    current_user: User,
    type: str | None = None,
    unread: bool | None = None,
) -> list[Notification]:
    query = db.query(Notification).filter(Notification.user_id == current_user.id)

    if type is not None:
        query = query.filter(Notification.type == type)

    if unread is not None:
        query = query.filter(Notification.is_read == (not unread))

    # Unread first, then newest first within each group
    return query.order_by(Notification.is_read.asc(), Notification.created_at.desc()).all()


def mark_as_read(db: Session, current_user: User, notification_id: UUID) -> Notification | None:
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()

    if not notification:
        return None

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def mark_all_as_read(db: Session, current_user: User) -> int:
    updated = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,  # noqa: E712
    ).update({"is_read": True})
    db.commit()
    return updated


def get_unread_count(db: Session, current_user: User) -> int:
    return db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,  # noqa: E712
    ).count()