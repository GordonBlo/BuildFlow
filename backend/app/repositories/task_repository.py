from sqlalchemy.orm import Session

from app.models.task_model import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate


def create_task(
    db: Session,
    project_id: int,
    task_data: TaskCreate
) -> Task:
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        project_id=project_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def get_tasks_by_project(db: Session, project_id: int) -> list[Task]:
    return (
        db.query(Task)
        .filter(Task.project_id == project_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def get_task_by_id_and_project(
    db: Session,
    task_id: int,
    project_id: int
) -> Task | None:
    return (
        db.query(Task)
        .filter(Task.id == task_id)
        .filter(Task.project_id == project_id)
        .first()
    )


def update_task(
    db: Session,
    task_id: int,
    project_id: int,
    task_data: TaskUpdate
) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        return None

    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


def complete_task(
    db: Session,
    task_id: int,
    project_id: int
) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        return None

    task.status = "done"
    db.commit()
    db.refresh(task)
    return task
