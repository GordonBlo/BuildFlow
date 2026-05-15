from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("")
def health_check():
    return {
        "status": "ok",
        "message": "BuildFlow API is running",
        "version": "0.6.0"
    }


@router.get("/db")
def database_health_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "message": "Database connection is working"
    }
