"""add priority to tasks

Revision ID: 211d702aa6e6
Revises: 47d46cabb4d8
Create Date: 2026-07-28 23:43:11.327949
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "211d702aa6e6"
down_revision: Union[str, None] = "47d46cabb4d8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column(
            "priority",
            sa.String(length=20),
            nullable=False,
            server_default="medium",
        ),
    )


def downgrade() -> None:
    op.drop_column("tasks", "priority")