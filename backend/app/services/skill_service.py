from uuid import UUID

from sqlalchemy.orm import Session

from app.models.skill import Skill, UserSkill
from app.schemas.skill import UserSkillCreate


def get_user_skills(db: Session, user_id: UUID):
    return db.query(UserSkill).filter(
        UserSkill.user_id == user_id
    ).all()


def add_user_skill(
    db: Session,
    user_id: UUID,
    skill_data: UserSkillCreate
):
    skill = db.query(Skill).filter(
        Skill.id == skill_data.skill_id
    ).first()

    if not skill:
        return "skill_not_found"

    existing = db.query(UserSkill).filter(
        UserSkill.user_id == user_id,
        UserSkill.skill_id == skill_data.skill_id
    ).first()

    if existing:
        return "duplicate"

    user_skill = UserSkill(
        user_id=user_id,
        skill_id=skill_data.skill_id,
        proficiency_level=skill_data.proficiency_level
    )

    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)

    return user_skill


def remove_user_skill(
    db: Session,
    user_id: UUID,
    skill_id: UUID
):
    user_skill = db.query(UserSkill).filter(
        UserSkill.user_id == user_id,
        UserSkill.skill_id == skill_id
    ).first()

    if not user_skill:
        return False

    db.delete(user_skill)
    db.commit()

    return True