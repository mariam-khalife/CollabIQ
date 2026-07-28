"""
ai/teammate_recommendation.py

Core logic for the Teammate Recommendation AI (Sprint 5).

Responsibilities covered here (previously missing from PR #27):
  1. Actual ranking logic based on skills, interests, availability,
     experience, and missing project role.
  2. Filtering so Team Leaders, existing members, and users with a
     pending invitation never enter the candidate pool.
  3. Hard cap of 5 recommendations.
  4. Structured output matching the backend contract exactly:
     user_id, name, role, compatibility_score, reason.
  5. Output validation (no duplicates, no excluded users, no empty
     reasons) so bad AI output is caught before it reaches the frontend.
"""

from dataclasses import dataclass, field
from typing import Iterable, Optional
import json


# ---------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------

@dataclass
class Candidate:
    user_id: str
    name: str
    role: str
    skills: set[str] = field(default_factory=set)
    interests: set[str] = field(default_factory=set)
    experience_level: int = 1          # 1 = junior ... 5 = expert
    is_available: bool = True
    is_team_leader: bool = False
    is_existing_member: bool = False
    has_pending_invitation: bool = False


@dataclass
class ProjectRequirements:
    missing_role: str
    required_skills: set[str] = field(default_factory=set)
    required_interests: set[str] = field(default_factory=set)
    min_experience_level: int = 1
    requires_availability: bool = True


# ---------------------------------------------------------------------
# Scoring weights (documented so they can be tuned without touching logic)
# ---------------------------------------------------------------------

WEIGHTS = {
    "skills": 0.40,
    "role_match": 0.25,
    "interests": 0.15,
    "experience": 0.10,
    "availability": 0.10,
}

MAX_RECOMMENDATIONS = 5


# ---------------------------------------------------------------------
# Step 1: Filtering (exclusion rules)
# ---------------------------------------------------------------------

def filter_eligible_candidates(candidates: Iterable[Candidate]) -> list[Candidate]:
    """
    Applies the three mandatory exclusion rules from the spec:
      - Team Leaders are never eligible.
      - Existing team members are never eligible.
      - Users with a pending invitation for this team are never eligible.
    """
    return [
        c for c in candidates
        if not c.is_team_leader
        and not c.is_existing_member
        and not c.has_pending_invitation
    ]


# ---------------------------------------------------------------------
# Step 2: Scoring
# ---------------------------------------------------------------------

def _jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def score_candidate(candidate: Candidate, req: ProjectRequirements) -> float:
    """
    Weighted compatibility score in [0, 1]. Combines:
      - skill overlap (Jaccard similarity vs. required skills)
      - role match (does the candidate's role fill the missing role?)
      - interest overlap
      - experience level relative to minimum required
      - availability match
    """
    skill_score = _jaccard(candidate.skills, req.required_skills)

    role_score = 1.0 if candidate.role.strip().lower() == req.missing_role.strip().lower() else 0.0

    interest_score = _jaccard(candidate.interests, req.required_interests)

    if req.min_experience_level <= 0:
        experience_score = 1.0
    else:
        experience_score = min(candidate.experience_level / req.min_experience_level, 1.0)

    availability_score = 1.0 if (candidate.is_available or not req.requires_availability) else 0.0

    total = (
        skill_score * WEIGHTS["skills"]
        + role_score * WEIGHTS["role_match"]
        + interest_score * WEIGHTS["interests"]
        + experience_score * WEIGHTS["experience"]
        + availability_score * WEIGHTS["availability"]
    )
    return round(min(max(total, 0.0), 1.0), 4)


# ---------------------------------------------------------------------
# Step 3: Reason generation (rule-based; ai/prompts/teammate_prompt.py
# provides the LLM-backed alternative for richer natural-language reasons)
# ---------------------------------------------------------------------

def generate_reason(candidate: Candidate, req: ProjectRequirements, score: float) -> str:
    matched_skills = candidate.skills & req.required_skills
    matched_interests = candidate.interests & req.required_interests

    parts = []
    if matched_skills:
        parts.append(f"strong {', '.join(sorted(matched_skills))} experience")
    if candidate.role.strip().lower() == req.missing_role.strip().lower():
        parts.append(f"direct fit for the open {req.missing_role} role")
    if matched_interests:
        parts.append(f"shared interest in {', '.join(sorted(matched_interests))}")

    if not parts:
        return "Limited overlap with current project requirements."

    return "Candidate has " + "; ".join(parts) + "."


# ---------------------------------------------------------------------
# Step 4: Ranking + cap + structured output
# ---------------------------------------------------------------------

def recommend_teammates(
    candidates: Iterable[Candidate],
    req: ProjectRequirements,
    max_results: int = MAX_RECOMMENDATIONS,
) -> list[dict]:
    eligible = filter_eligible_candidates(candidates)

    scored = [
        (c, score_candidate(c, req))
        for c in eligible
    ]

    # Rank highest to lowest; stable tie-break on name for determinism.
    scored.sort(key=lambda pair: (-pair[1], pair[0].name.lower()))

    top = scored[:max_results]

    results = [
        {
            "user_id": c.user_id,
            "name": c.name,
            "role": c.role,
            "compatibility_score": score,
            "reason": generate_reason(c, req, score),
        }
        for c, score in top
    ]

    validate_recommendation_output(results, eligible)
    return results


# ---------------------------------------------------------------------
# Step 5: Output validation (catches the exact bug classes the notes flagged:
# wrong scores, duplicate users, empty reasons, bad ranking)
# ---------------------------------------------------------------------

class RecommendationValidationError(Exception):
    pass


def validate_recommendation_output(results: list[dict], eligible: list[Candidate]) -> None:
    eligible_ids = {c.user_id for c in eligible}

    if len(results) > MAX_RECOMMENDATIONS:
        raise RecommendationValidationError(
            f"Returned {len(results)} recommendations; max is {MAX_RECOMMENDATIONS}."
        )

    seen_ids = set()
    for r in results:
        for field_name in ("user_id", "name", "role", "compatibility_score", "reason"):
            if field_name not in r:
                raise RecommendationValidationError(f"Missing field '{field_name}' in result: {r}")

        if r["user_id"] in seen_ids:
            raise RecommendationValidationError(f"Duplicate user_id in results: {r['user_id']}")
        seen_ids.add(r["user_id"])

        if r["user_id"] not in eligible_ids:
            raise RecommendationValidationError(
                f"user_id {r['user_id']} is not in the eligible pool (leader/member/pending leak)."
            )

        if not (0.0 <= r["compatibility_score"] <= 1.0):
            raise RecommendationValidationError(
                f"compatibility_score out of range for {r['user_id']}: {r['compatibility_score']}"
            )

        if not r["reason"] or not r["reason"].strip():
            raise RecommendationValidationError(f"Empty reason for user_id {r['user_id']}.")

    scores = [r["compatibility_score"] for r in results]
    if scores != sorted(scores, reverse=True):
        raise RecommendationValidationError("Results are not sorted highest-to-lowest.")


def to_backend_format(results: list[dict]) -> str:
    """Serializes results to the exact backend JSON contract from the spec."""
    return json.dumps({"status": "success", "data": results}, indent=2)
