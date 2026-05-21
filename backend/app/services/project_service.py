from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repositories.project_repository import (
    create_project,
    get_project_by_id_and_owner,
    get_projects_by_owner,
)
from app.schemas.project_schema import ProjectCreate


def create_project_for_user(
    db: Session,
    project_data: ProjectCreate,
    current_user: User
):
    return create_project(
        db=db,
        project_data=project_data,
        owner_id=current_user.id
    )


def get_my_projects(db: Session, current_user: User):
    return get_projects_by_owner(
        db=db,
        owner_id=current_user.id
    )


def get_my_project_by_id(
    db: Session,
    project_id: int,
    current_user: User
):
    project = get_project_by_id_and_owner(
        db=db,
        project_id=project_id,
        owner_id=current_user.id
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project