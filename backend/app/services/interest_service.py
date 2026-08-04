from uuid import UUID

from sqlalchemy.orm import Session

from app.models.interest import Interest, UserInterest
from app.schemas.interest import UserInterestCreate


def list_interests(db: Session):
    """The shared interest catalogue users pick from."""
    return db.query(Interest).order_by(Interest.name).all()


def get_user_interests(db: Session, user_id: UUID):
    # Joined to the catalogue so the response carries the interest name,
    # which is what clients actually display.
    rows = (
        db.query(UserInterest, Interest.name)
        .join(Interest, Interest.id == UserInterest.interest_id)
        .filter(UserInterest.user_id == user_id)
        .order_by(Interest.name)
        .all()
    )

    return [
        {
            "id": user_interest.id,
            "user_id": user_interest.user_id,
            "interest_id": user_interest.interest_id,
            "interest_name": name,
        }
        for user_interest, name in rows
    ]


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