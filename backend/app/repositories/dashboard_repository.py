from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.project_model import Project
from app.models.task_model import Task
from app.schemas.dashboard_schema import DashboardSummaryResponse


def get_dashboard_summary_by_owner(
    db: Session,
    owner_id: int,
) -> DashboardSummaryResponse:
    project_totals = (
        db.query(
            func.count(Project.id).label("total_projects"),
            func.coalesce(
                func.sum(case((Project.status == "active", 1), else_=0)),
                0,
            ).label("active_projects"),
            func.coalesce(
                func.sum(case((Project.status == "planned", 1), else_=0)),
                0,
            ).label("planned_projects"),
            func.coalesce(
                func.sum(case((Project.status == "completed", 1), else_=0)),
                0,
            ).label("completed_projects"),
            func.coalesce(
                func.sum(case((Project.is_archived.is_(True), 1), else_=0)),
                0,
            ).label("archived_projects"),
            func.coalesce(func.sum(Project.budget), 0.0).label("total_budget"),
        )
        .filter(Project.owner_id == owner_id)
        .one()
    )

    task_totals = (
        db.query(
            func.count(Task.id).label("total_tasks"),
            func.coalesce(
                func.sum(case((Task.status == "todo", 1), else_=0)),
                0,
            ).label("todo_tasks"),
            func.coalesce(
                func.sum(case((Task.status == "in_progress", 1), else_=0)),
                0,
            ).label("in_progress_tasks"),
            func.coalesce(
                func.sum(case((Task.status == "done", 1), else_=0)),
                0,
            ).label("done_tasks"),
        )
        .join(Project, Task.project_id == Project.id)
        .filter(Project.owner_id == owner_id)
        .one()
    )

    return DashboardSummaryResponse(
        total_projects=project_totals.total_projects,
        active_projects=project_totals.active_projects,
        planned_projects=project_totals.planned_projects,
        completed_projects=project_totals.completed_projects,
        archived_projects=project_totals.archived_projects,
        total_budget=float(project_totals.total_budget),
        total_tasks=task_totals.total_tasks,
        todo_tasks=task_totals.todo_tasks,
        in_progress_tasks=task_totals.in_progress_tasks,
        done_tasks=task_totals.done_tasks,
    )
