from sqlalchemy.orm import Session

from app.models.project_model import Project
from app.schemas.project_schema import ProjectCreate


def create_project(
    db: Session,
    project_data: ProjectCreate,
    owner_id: int
) -> Project:
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        client_name=project_data.client_name,
        status=project_data.status,
        budget=project_data.budget,
        start_date=project_data.start_date,
        deadline=project_data.deadline,
        owner_id=owner_id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def get_projects_by_owner(db: Session, owner_id: int) -> list[Project]:
    return (
        db.query(Project)
        .filter(Project.owner_id == owner_id)
        .order_by(Project.created_at.desc())
        .all()
    )


def get_project_by_id_and_owner(
    db: Session,
    project_id: int,
    owner_id: int
) -> Project | None:
    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .filter(Project.owner_id == owner_id)
        .first()
    )