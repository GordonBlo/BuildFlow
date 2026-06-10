from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repositories.project_repository import (
    archive_project,
    create_project,
    get_project_by_id_and_owner,
    get_projects_by_owner,
    update_project,
)
from app.schemas.project_schema import ProjectCreate, ProjectUpdate


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


def get_my_projects(
    db: Session,
    current_user: User,
    include_archived: bool = False
):
    return get_projects_by_owner(
        db=db,
        owner_id=current_user.id,
        include_archived=include_archived
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


def update_my_project(
    db: Session,
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User
):
    project = update_project(
        db=db,
        project_id=project_id,
        owner_id=current_user.id,
        project_data=project_data
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


def archive_my_project(
    db: Session,
    project_id: int,
    current_user: User
):
    project = archive_project(
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
