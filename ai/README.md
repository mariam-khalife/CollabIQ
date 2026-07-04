# CollabIQ Teammate Matching

Implements AI Team Matching from the SE documentation (FR-2.7 to FR-2.9): a Team Leader
requests candidate teammates, and the system returns a ranked list with a match score and
a suggested role for each. Suggestion-only — this module never writes to `TEAM_MEMBERS`
or creates invitations.

## How it works

- Each proficiency level is worth points: beginner = 1, intermediate = 2, advanced = 3.
- A candidate's score is the points they earn across the team's required skills, divided
  by the maximum possible (advanced at everything), giving a value from 0.0 to 1.0.
- The candidate's strongest required skill determines their suggested role, via the
  skill's category (e.g. a "Backend" skill maps to the Backend Developer role).
- The team leader, confirmed members, and anyone with a pending invitation to the team
  are excluded — only genuinely available candidates are suggested.
- Results are cached in the `match_suggestions` table; regenerating replaces the
  previous suggestions for the team.

## Structure

```
ai/
├── matching.py   # scoring + ranking algorithm, no external deps
├── service.py    # loads candidates from the DB, runs the algorithm,
│                 # persists results into match_suggestions
└── tests/
    ├── test_matching.py  # pure algorithm tests, no DB needed
    └── test_service.py   # integration tests against a real Postgres instance
```

## Running tests

```bash
pip install -r ai/requirements.txt pytest
# test_service.py needs a running Postgres with the database/ migrations applied
python -m pytest ai/tests/ -v
```
