from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth_dependencies import get_current_user
from app.core.database import get_db
from app.models.user_model import User
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.project_service import (
    create_project_for_user,
    get_my_project_by_id,
    get_my_projects,
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_my_projects(
        db=db,
        current_user=current_user
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