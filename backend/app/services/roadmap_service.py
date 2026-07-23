from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.roadmap import Roadmap, RoadmapPhase
from app.models.team import Team
from app.models.user import User
from app.models.task import Task
from app.schemas.roadmap import RoadmapCreate, RoadmapPhaseStatusUpdate



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
            status="todo"
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

def get_phase_by_id(
    db: Session,
    phase_id: UUID
):
    return db.query(RoadmapPhase).filter(
        RoadmapPhase.id == phase_id
    ).first()


def update_phase_status(
    db: Session,
    phase_id: UUID,
    phase_data: RoadmapPhaseStatusUpdate,
    current_user: User
):
    phase = get_phase_by_id(db, phase_id)

    if not phase:
        return "phase_not_found"

    roadmap = db.query(Roadmap).filter(
        Roadmap.id == phase.roadmap_id
    ).first()

    if not roadmap:
        return "roadmap_not_found"

    project = db.query(Project).filter(
        Project.id == roadmap.project_id
    ).first()

    if not project:
        return "project_not_found"

    team = db.query(Team).filter(
        Team.id == project.team_id
    ).first()

    if not team or team.leader_id != current_user.id:
        return "not_leader"

    phase.status = phase_data.status

    db.commit()
    db.refresh(phase)

    return phase

def calculate_roadmap_progress(
    db: Session,
    roadmap_id: UUID
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id
    ).first()

    if not roadmap:
        return None

    phases = db.query(RoadmapPhase).filter(
        RoadmapPhase.roadmap_id == roadmap.id
    ).all()

    total_phases = len(phases)

    completed_phases = sum(
        1
        for phase in phases
        if phase.status == "done"
    )

    phase_ids = [
        phase.id
        for phase in phases
    ]

    tasks = []

    if phase_ids:
        tasks = db.query(Task).filter(
            Task.phase_id.in_(phase_ids)
        ).all()

    total_tasks = len(tasks)

    completed_tasks = sum(
        1
        for task in tasks
        if task.status == "done"
    )

    if total_tasks > 0:
        progress_percentage = round(
            completed_tasks / total_tasks * 100,
            2
        )
    elif total_phases > 0:
        progress_percentage = round(
            completed_phases / total_phases * 100,
            2
        )
    else:
        progress_percentage = 0.0

    return {
        "roadmap_id": roadmap.id,
        "project_id": roadmap.project_id,
        "progress_percentage": progress_percentage,
        "total_phases": total_phases,
        "completed_phases": completed_phases,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
    }