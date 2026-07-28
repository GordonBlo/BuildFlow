import type { TaskResponse } from "../../types/task";

type TaskCardProps = {
  task: TaskResponse;
};

function formatDueDate(dueDate: string): string {
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString();
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <article>
      <header>
        <h3>{task.title}</h3>
      </header>

      {task.description && <p>{task.description}</p>}

      <dl>
        <dt>Status</dt>
        <dd>{task.status}</dd>

        <dt>Priority</dt>
        <dd>{task.priority}</dd>

        {task.due_date && (
          <>
            <dt>Due date</dt>
            <dd>{formatDueDate(task.due_date)}</dd>
          </>
        )}
      </dl>
    </article>
  );
}

export default TaskCard;
