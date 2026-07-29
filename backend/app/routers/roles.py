from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.team import Role
from app.schemas.role import RoleResponse


router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return (
        db.query(Role)
        .order_by(Role.role_name.asc())
        .all()
    )