from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.user_schema import UserCreate
from app.services.password_service import hash_password


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
