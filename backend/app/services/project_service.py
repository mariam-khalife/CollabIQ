from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.team import Team,TeamMember
from app.models.user import User
from app.models.project_recommendation import ProjectRecommendation
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services.reputation_service import add_reputation_event


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

    recommendation = None

    if project_data.recommendation_id:
        recommendation = db.query(ProjectRecommendation).filter(
            ProjectRecommendation.id == project_data.recommendation_id,
            ProjectRecommendation.team_id == project_data.team_id,
        ).first()

        if not recommendation:
            return "recommendation_not_found"

    project = Project(
        team_id=project_data.team_id,
        recommendation_id=(
            recommendation.id if recommendation else None
        ),
        title=(
            recommendation.title
            if recommendation
            else project_data.title
        ),
        description=(
            recommendation.description
            if recommendation
            else project_data.description
        ),
        status="accepted"
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

    old_status = project.status

    for field, value in update_data.items():
        setattr(project, field, value)

    if (
        old_status != "completed"
        and project.status == "completed"
    ):
        team = db.query(Team).filter(
            Team.id == project.team_id
        ).first()

        if team:
            member_ids = {
                member.user_id
                for member in db.query(TeamMember).filter(
                    TeamMember.team_id == team.id
                ).all()
            }

            member_ids.add(team.leader_id)

            for user_id in member_ids:
                add_reputation_event(
                    db,
                    user_id,
                    "project_completed",
                )

    db.commit()
    db.refresh(project)

    return project

def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()