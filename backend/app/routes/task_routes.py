from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth_dependencies import get_current_user
from app.core.database import get_db
from app.models.user_model import User
from app.schemas.task_schema import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import (
    complete_my_project_task,
    create_task_for_project,
    get_my_project_task,
    get_my_project_tasks,
    update_my_project_task,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Tasks"]
)


@router.post(
    "/{project_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    project_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_task_for_project(
        db=db,
        project_id=project_id,
        task_data=task_data,
        current_user=current_user
    )


@router.get(
    "/{project_id}/tasks",
    response_model=list[TaskResponse],
    status_code=status.HTTP_200_OK
)
def list_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_project_tasks(
        db=db,
        project_id=project_id,
        current_user=current_user
    )


@router.get(
    "/{project_id}/tasks/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK
)
def get_task_detail(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_project_task(
        db=db,
        project_id=project_id,
        task_id=task_id,
        current_user=current_user
    )


@router.patch(
    "/{project_id}/tasks/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK
)
def update_task(
    project_id: int,
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_my_project_task(
        db=db,
        project_id=project_id,
        task_id=task_id,
        task_data=task_data,
        current_user=current_user
    )


@router.patch(
    "/{project_id}/tasks/{task_id}/complete",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK
)
def complete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complete_my_project_task(
        db=db,
        project_id=project_id,
        task_id=task_id,
        current_user=current_user
    )
