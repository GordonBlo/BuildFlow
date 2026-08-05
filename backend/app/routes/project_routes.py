from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth_dependencies import get_current_user
from app.core.database import get_db
from app.models.user_model import User
from app.schemas.project_schema import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import (
    archive_my_project,
    create_project_for_user,
    get_my_project_by_id,
    get_my_projects,
    unarchive_my_project,
    update_my_project,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_project_for_user(
        db=db,
        project_data=project_data,
        current_user=current_user
    )


@router.get(
    "",
    response_model=list[ProjectResponse],
    status_code=status.HTTP_200_OK
)
def list_projects(
    include_archived: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_projects(
        db=db,
        current_user=current_user,
        include_archived=include_archived
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK
)
def get_project_detail(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_project_by_id(
        db=db,
        project_id=project_id,
        current_user=current_user
    )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK
)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_my_project(
        db=db,
        project_id=project_id,
        project_data=project_data,
        current_user=current_user
    )


@router.patch(
    "/{project_id}/archive",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK
)
def archive_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return archive_my_project(
        db=db,
        project_id=project_id,
        current_user=current_user
    )


@router.patch(
    "/{project_id}/unarchive",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK
)
def unarchive_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return unarchive_my_project(
        db=db,
        project_id=project_id,
        current_user=current_user
    )
