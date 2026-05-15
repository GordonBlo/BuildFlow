from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth_dependencies import get_current_user
from app.core.database import get_db
from app.models.user_model import User
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import login_user, register_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)

def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user_data)

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db=db, login_data=login_data)

@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK
)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user