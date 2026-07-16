from uuid import UUID

from sqlalchemy.orm import Session

from app.models.interest import Interest, UserInterest
from app.schemas.interest import UserInterestCreate


def get_user_interests(db: Session, user_id: UUID):
    return db.query(UserInterest).filter(
        UserInterest.user_id == user_id
    ).all()


def add_user_interest(
    db: Session,
    user_id: UUID,
    interest_data: UserInterestCreate
):
    interest = db.query(Interest).filter(
        Interest.id == interest_data.interest_id
    ).first()

    if not interest:
        return "interest_not_found"

    existing = db.query(UserInterest).filter(
        UserInterest.user_id == user_id,
        UserInterest.interest_id == interest_data.interest_id
    ).first()

    if existing:
        return "duplicate"

    user_interest = UserInterest(
        user_id=user_id,
        interest_id=interest_data.interest_id
    )

    db.add(user_interest)
    db.commit()
    db.refresh(user_interest)

    return user_interest


def remove_user_interest(
    db: Session,
    user_id: UUID,
    interest_id: UUID
):
    user_interest = db.query(UserInterest).filter(
        UserInterest.user_id == user_id,
        UserInterest.interest_id == interest_id
    ).first()

    if not user_interest:
        return False

    db.delete(user_interest)
    db.commit()

    return True