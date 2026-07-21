from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.roadmap import Roadmap, RoadmapPhase
from app.models.team import Team
from app.models.user import User
from app.schemas.roadmap import RoadmapCreate


def create_roadmap(
    db: Session,
    roadmap_data: RoadmapCreate,
    current_user: User
):
    project = db.query(Project).filter(
        Project.id == roadmap_data.project_id
    ).first()

    if not project:
        return "project_not_found"

    team = db.query(Team).filter(
        Team.id == project.team_id
    ).first()

    if not team or team.leader_id != current_user.id:
        return "not_leader"

    existing = db.query(Roadmap).filter(
        Roadmap.project_id == roadmap_data.project_id
    ).first()

    if existing:
        return "roadmap_exists"

    roadmap = Roadmap(
        project_id=roadmap_data.project_id,
        generated_by=roadmap_data.generated_by
    )

    db.add(roadmap)
    db.flush()

    for phase_data in roadmap_data.phases:
        phase = RoadmapPhase(
            roadmap_id=roadmap.id,
            phase_name=phase_data.phase_name,
            phase_order=phase_data.phase_order,
            target_date=phase_data.target_date,
            status="not_started"
        )

        db.add(phase)

    db.commit()
    db.refresh(roadmap)

    return roadmap


def get_roadmap_by_project(db: Session, project_id: UUID):
    roadmap = db.query(Roadmap).filter(
        Roadmap.project_id == project_id
    ).first()

    if not roadmap:
        return None

    phases = db.query(RoadmapPhase).filter(
        RoadmapPhase.roadmap_id == roadmap.id
    ).order_by(RoadmapPhase.phase_order).all()

    return {
        "id": roadmap.id,
        "project_id": roadmap.project_id,
        "generated_by": roadmap.generated_by,
        "created_at": roadmap.created_at,
        "phases": phases
    }