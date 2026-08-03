from datetime import datetime, date
from typing import Literal

from pydantic import BaseModel, Field


ProjectStatus = Literal["planned", "active", "completed"]


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    client_name: str | None = Field(default=None, max_length=120)
    status: ProjectStatus = "planned"
    budget: float = Field(default=0.0, ge=0.0)
    start_date: date | None = None
    deadline: date | None = None


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    client_name: str | None = Field(default=None, max_length=120)
    status: ProjectStatus | None = None
    budget: float | None = Field(default=None, ge=0.0)
    start_date: date | None = None
    deadline: date | None = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    client_name: str | None
    status: ProjectStatus
    budget: float
    start_date: date | None
    deadline: date | None
    owner_id: int
    is_archived: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
