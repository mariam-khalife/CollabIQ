from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.reputation import ReputationLog
from app.schemas.reputation import ReputationEventCreate

REPUTATION_POINTS = {
    "task_completed": 20,
    "project_completed": 100,
    "team_joined": 10,
    "positive_feedback": 15,
    "deadline_missed": -10,
    "left_project_early": -20,
}

def add_reputation_event(
    db: Session,
    user_id: UUID,
    activity_type: str,
):
    points = REPUTATION_POINTS.get(activity_type)

    if points is None:
        raise ValueError("Invalid reputation activity type")

    log = ReputationLog(
        user_id=user_id,
        activity_type=activity_type,
        points=points,
    )

    db.add(log)

    return log

def get_reputation_level(score: int) -> str:
    if score >= 800:
        return "Top Contributor"

    if score >= 500:
        return "Active Contributor"

    if score >= 250:
        return "Reliable Teammate"

    if score >= 100:
        return "Growing Contributor"

    return "New Member"


def create_reputation_event(
    db: Session,
    user_id: UUID,
    event_data: ReputationEventCreate,
) -> ReputationLog:
    reputation_log = ReputationLog(
        user_id=user_id,
        activity_type=event_data.activity_type,
        points=event_data.points,
    )

    db.add(reputation_log)
    db.commit()
    db.refresh(reputation_log)

    return reputation_log


def get_user_reputation_logs(
    db: Session,
    user_id: UUID,
) -> list[ReputationLog]:
    return (
        db.query(ReputationLog)
        .filter(ReputationLog.user_id == user_id)
        .order_by(ReputationLog.logged_at.desc())
        .all()
    )


def calculate_user_reputation_score(
    db: Session,
    user_id: UUID,
) -> int:
    score = (
        db.query(func.coalesce(func.sum(ReputationLog.points), 0))
        .filter(ReputationLog.user_id == user_id)
        .scalar()
    )

    return int(score or 0)


def get_user_reputation_summary(
    db: Session,
    user_id: UUID,
) -> dict:
    logs = get_user_reputation_logs(db, user_id)
    score = calculate_user_reputation_score(db, user_id)

    return {
        "user_id": user_id,
        "score": score,
        "level": get_reputation_level(score),
        "total_events": len(logs),
        "history": logs,
    }