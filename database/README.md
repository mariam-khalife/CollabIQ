# CollabIQ Database

PostgreSQL schema for CollabIQ, implemented with SQLAlchemy models and Alembic migrations, matching the ERD in `docs/CollabIQ_SE_Documentation.pdf` (Chapter 5).

## Setup

```bash
cd database
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # set DATABASE_URL to your local PostgreSQL instance
```

## Running migrations

```bash
alembic upgrade head    # apply all migrations
alembic downgrade base  # roll back everything
```

## Structure

```
database/
├── models/          # SQLAlchemy declarative models, one file per domain area
├── migrations/       # Alembic environment and versioned migration scripts
├── session.py        # engine + session factory used by the backend
├── alembic.ini
└── requirements.txt
```

## Schema

15 entities: `users`, `skills`, `user_skills`, `interests`, `user_interests`, `roles`, `teams`, `team_invitations`, `team_members`, `match_suggestions`, `project_recommendations`, `projects`, `roadmaps`, `roadmap_phases`, `tasks`, `reputation_logs`.

Team membership can only be created from an accepted `team_invitations` row (`team_members.invitation_id` is a required, unique foreign key) — this enforces the "AI only suggests, a human decides" rule at the schema level, not just in application code.
