from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repositories.dashboard_repository import get_dashboard_summary_by_owner
from app.schemas.dashboard_schema import DashboardSummaryResponse


def get_dashboard_summary_for_user(
    db: Session,
    current_user: User,
) -> DashboardSummaryResponse:
    return get_dashboard_summary_by_owner(
        db=db,
        owner_id=current_user.id,
    )
