"""make project recommendation optional

Revision ID: b6e035c1f20e
Revises: f9bb912ed8d2
Create Date: 2026-07-22 22:26:26.988229
"""

from typing import Sequence, Union

from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "b6e035c1f20e"
down_revision: Union[str, None] = "f9bb912ed8d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "projects",
        "recommendation_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=True,
    )


def downgrade():
    op.alter_column(
        "projects",
        "recommendation_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False,
    )