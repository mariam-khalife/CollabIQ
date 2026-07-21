from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.team import Team
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate


def create_project(
    db: Session,
    project_data: ProjectCreate,
    current_user: User
):
    team = db.query(Team).filter(
        Team.id == project_data.team_id
    ).first()

    if not team:
        return "team_not_found"

    if team.leader_id != current_user.id:
        return "not_leader"

    existing_project = db.query(Project).filter(
        Project.team_id == project_data.team_id
    ).first()

    if existing_project:
        return "project_exists"

    project = Project(
        team_id=project_data.team_id,
        recommendation_id=project_data.recommendation_id,
        title=project_data.title,
        description=project_data.description,
        status="planning"
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_project_by_id(db: Session, project_id: UUID):
    return db.query(Project).filter(
        Project.id == project_id
    ).first()


def get_team_project(db: Session, team_id: UUID):
    return db.query(Project).filter(
        Project.team_id == team_id
    ).first()


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate
):
    update_data = project_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()