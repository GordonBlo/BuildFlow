from __future__ import annotations

import os
import sys
from collections.abc import Mapping
from pathlib import Path

from sqlalchemy import func


BACKEND_DIR = Path(__file__).resolve().parent.parent
os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import SQLALCHEMY_DATABASE_URL, SessionLocal  # noqa: E402
from app.models.project_model import Project  # noqa: E402


STATUS_NORMALIZATION_MAP = {
    "planned": "planned",
    "active": "active",
    "completed": "completed",
    "in_progress": "active",
    "complete": "completed",
    "done": "completed",
}


def get_status_counts(db) -> dict[str | None, int]:
    rows = (
        db.query(Project.status, func.count(Project.id))
        .group_by(Project.status)
        .order_by(Project.status)
        .all()
    )
    return {status: count for status, count in rows}


def normalized_status(value: str | None) -> str | None:
    if not isinstance(value, str):
        return None

    return STATUS_NORMALIZATION_MAP.get(value.lower())


def print_status_counts(
    heading: str,
    status_counts: Mapping[str | None, int],
) -> None:
    print(heading)

    if not status_counts:
        print("  (no Project rows found)")
        return

    for status, count in status_counts.items():
        target = normalized_status(status)
        target_note = "" if status == target else f" -> {target!r}"
        print(f"  {status!r}: {count} row(s){target_note}")


def main() -> int:
    print(f"Database configuration: {SQLALCHEMY_DATABASE_URL}")
    db = SessionLocal()

    try:
        before_counts = get_status_counts(db)
        print_status_counts("Distinct Project statuses before normalization:", before_counts)

        unknown_statuses = {
            status: count
            for status, count in before_counts.items()
            if normalized_status(status) is None
        }

        if unknown_statuses:
            print_status_counts(
                "Unknown Project statuses found; no data was modified:",
                unknown_statuses,
            )
            db.rollback()
            return 1

        total_updated = 0

        for current_status, count in before_counts.items():
            target_status = normalized_status(current_status)

            if current_status == target_status:
                continue

            affected_rows = (
                db.query(Project)
                .filter(Project.status == current_status)
                .update(
                    {Project.status: target_status},
                    synchronize_session=False,
                )
            )

            if affected_rows != count:
                db.rollback()
                print(
                    "Row count changed during normalization; "
                    "the transaction was rolled back.",
                )
                return 1

            total_updated += affected_rows

        db.commit()
        print(f"Committed {total_updated} Project status update(s).")

        final_counts = get_status_counts(db)
        print_status_counts("Final distinct Project statuses:", final_counts)
        return 0
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
