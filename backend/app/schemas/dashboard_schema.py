from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_projects: int
    active_projects: int
    planned_projects: int
    completed_projects: int
    archived_projects: int
    total_budget: float
    total_tasks: int
    todo_tasks: int
    in_progress_tasks: int
    done_tasks: int
