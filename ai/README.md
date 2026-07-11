# CollabIQ AI Features

Two features live here, both suggestion-only — this module never writes to `TEAM_MEMBERS`
or creates invitations; a human always makes the final decision.

## 1. Teammate Matching (FR-2.7 to FR-2.9)

A Team Leader requests candidate teammates and gets a ranked list (max 5) with a match
score and a suggested role for each. Rule-based — no LLM call, instant, free.

- Each proficiency level is worth points: beginner = 1, intermediate = 2, advanced = 3.
- A candidate's score is the points they earn across the team's required skills, divided
  by the maximum possible (advanced at everything), giving a value from 0.0 to 1.0.
- The candidate's strongest required skill determines their suggested role, via the
  skill's category (e.g. a "Backend" skill maps to the Backend Developer role).
- The team leader, confirmed members, and anyone with a pending invitation to the team
  are excluded — only genuinely available candidates are suggested.
- Results are cached in the `match_suggestions` table; regenerating replaces the
  previous suggestions for the team.

## 2. Project Suggestions (FR-3.1 to FR-3.3)

Generates project ideas that fit the team's combined skills and interests, using an LLM.
Results are cached in `project_recommendations`; regenerating replaces the previous set.

Provider-agnostic: any OpenAI-compatible API works. Configure in `.env`:

```
LLM_API_KEY=your-key-here
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
LLM_MODEL=gemini-2.5-flash
```

The defaults target Google Gemini's free tier (get a key at https://aistudio.google.com —
no credit card needed). Switching to OpenAI, Groq, or GitHub Models only requires changing
these three variables. Never commit `.env` — it is git-ignored.

## Structure

```
ai/
├── matching.py        # teammate scoring + ranking algorithm, no external deps
├── recommendations.py # LLM client for project ideas (OpenAI-compatible, retry/backoff)
├── prompts.py         # prompt templates
├── schemas.py         # Pydantic validation of LLM JSON responses
├── service.py         # loads team data from the DB, runs the algorithms,
│                      # persists results (match_suggestions, project_recommendations)
└── tests/
    ├── test_matching.py  # pure algorithm tests, no DB needed
    └── test_service.py   # integration tests against a real Postgres instance
                          # (LLM calls are mocked - no API key needed to run tests)
```

## Running tests

```bash
pip install -r ai/requirements.txt pytest
# test_service.py needs a running Postgres with the database/ migrations applied,
# reset to a clean state (test fixtures collide with seeded sample data).
# Set DATABASE_URL in a .env file (or the environment) to point at your own
# Postgres instance - each teammate's user/password/db name can differ.
python -m pytest ai/tests/ -v
```
