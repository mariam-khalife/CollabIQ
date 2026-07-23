"""fix task assignment foreign key

Revision ID: 47d46cabb4d8
Revises: b6e035c1f20e
Create Date: 2026-07-24
"""

from typing import Sequence, Union

from alembic import op


revision: str = "47d46cabb4d8"
down_revision: Union[str, Sequence[str], None] = "b6e035c1f20e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        "tasks_assigned_to_fkey",
        "tasks",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "tasks_assigned_to_fkey",
        "tasks",
        "users",
        ["assigned_to"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        "tasks_assigned_to_fkey",
        "tasks",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "tasks_assigned_to_fkey",
        "tasks",
        "team_members",
        ["assigned_to"],
        ["id"],
    )