from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Date, Float, ForeignKey, Integer, String, Text

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String(120), nullable=True)
    status = Column(String(50), default="planned", nullable=False)
    budget = Column(Float, default=0.0, nullable=False)
    start_date = Column(Date, nullable=True)
    deadline = Column(Date, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )