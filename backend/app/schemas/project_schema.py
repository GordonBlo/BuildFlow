from datetime import datetime, date

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    client_name: str | None = Field(default=None, max_length=120)
    status: str = Field(default="planned", max_length=50)
    budget: float = Field(default=0.0, ge=0.0)
    start_date: date | None = None
    deadline: date | None = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    client_name: str | None
    status: str
    budget: float
    start_date: date | None
    deadline: date | None
    owner_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }