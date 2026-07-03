from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.project_model import Project
from app.models.task_model import Task
from app.models.user_model import User
from app.repositories.project_repository import get_project_by_id_and_owner
from app.repositories.task_repository import (
    complete_task,
    create_task,
    get_task_by_id_and_project,
    get_tasks_by_project,
    update_task,
)
from app.schemas.task_schema import TaskCreate, TaskUpdate


def _get_owned_project_or_404(
    db: Session,
    project_id: int,
    current_user: User
) -> Project:
    project = get_project_by_id_and_owner(
        db=db,
        project_id=project_id,
        owner_id=current_user.id
    )

    if project is None or project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


def _ensure_project_is_editable(project: Project) -> None:
    if project.is_archived:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Archived projects are read-only"
        )


def create_task_for_project(
    db: Session,
    project_id: int,
    task_data: TaskCreate,
    current_user: User
) -> Task:
    project = _get_owned_project_or_404(
        db=db,
        project_id=project_id,
        current_user=current_user
    )
    _ensure_project_is_editable(project)

    return create_task(
        db=db,
        project_id=project_id,
        task_data=task_data
    )


def get_my_project_tasks(
    db: Session,
    project_id: int,
    current_user: User
) -> list[Task]:
    _get_owned_project_or_404(
        db=db,
        project_id=project_id,
        current_user=current_user
    )

    return get_tasks_by_project(
        db=db,
        project_id=project_id
    )


def get_my_project_task(
    db: Session,
    project_id: int,
    task_id: int,
    current_user: User
) -> Task:
    _get_owned_project_or_404(
        db=db,
        project_id=project_id,
        current_user=current_user
    )

    task = get_task_by_id_and_project(
        db=db,
        task_id=task_id,
        project_id=project_id
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


def update_my_project_task(
    db: Session,
    project_id: int,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User
) -> Task:
    project = _get_owned_project_or_404(
        db=db,
        project_id=project_id,
        current_user=current_user
    )
    _ensure_project_is_editable(project)

    task = update_task(
        db=db,
        task_id=task_id,
        project_id=project_id,
        task_data=task_data
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


def complete_my_project_task(
    db: Session,
    project_id: int,
    task_id: int,
    current_user: User
) -> Task:
    project = _get_owned_project_or_404(
        db=db,
        project_id=project_id,
        current_user=current_user
    )
    _ensure_project_is_editable(project)

    task = complete_task(
        db=db,
        task_id=task_id,
        project_id=project_id
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task
