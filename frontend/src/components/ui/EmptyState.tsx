import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <div className="empty-state__content">
        <h3>{title}</h3>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>
      {children && <div className="empty-state__action">{children}</div>}
    </section>
  );
}

export default EmptyState;
