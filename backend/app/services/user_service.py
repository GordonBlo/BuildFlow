from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth_schema import LoginRequest
from app.schemas.user_schema import UserCreate
from app.services.password_service import hash_password, verify_password
from app.services.jwt_service import create_access_token


def register_user(db: Session, user_data: UserCreate):
    existing_user = get_user_by_email(db, user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    password_hash = hash_password(user_data.password)

    return create_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash
    )

def login_user(db: Session, login_data: LoginRequest):
    user = get_user_by_email(db, login_data.email)

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    password_is_valid = verify_password(
        plain_password=login_data.password,
        hashed_password=user.password_hash
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }