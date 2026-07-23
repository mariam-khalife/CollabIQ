from dataclasses import dataclass
from uuid import UUID

PROFICIENCY_WEIGHTS = {"beginner": 1, "intermediate": 2, "advanced": 3}
MAX_PROFICIENCY_WEIGHT = max(PROFICIENCY_WEIGHTS.values())


@dataclass
class CandidateProfile:
    user_id: UUID
    skills: dict[UUID, str]  # skill_id -> proficiency_level


@dataclass
class MatchResult:
    user_id: UUID
    match_score: float
    suggested_skill_id: UUID | None


def score_candidate(required_skill_ids: list[UUID], candidate: CandidateProfile) -> MatchResult:
    if not required_skill_ids:
        return MatchResult(user_id=candidate.user_id, match_score=0.0, suggested_skill_id=None)

    max_possible = len(required_skill_ids) * MAX_PROFICIENCY_WEIGHT
    earned = 0
    best_skill_id: UUID | None = None
    best_weight = 0

    for skill_id in required_skill_ids:
        level = candidate.skills.get(skill_id)
        if level is None:
            continue
        weight = PROFICIENCY_WEIGHTS.get(level.lower(), 0)
        earned += weight
        if weight > best_weight:
            best_weight = weight
            best_skill_id = skill_id

    return MatchResult(
        user_id=candidate.user_id,
        match_score=round(earned / max_possible, 2),
        suggested_skill_id=best_skill_id,
    )


def rank_candidates(
    required_skill_ids: list[UUID], candidates: list[CandidateProfile], count: int
) -> list[MatchResult]:
    scored = [score_candidate(required_skill_ids, candidate) for candidate in candidates]
    scored.sort(key=lambda result: result.match_score, reverse=True)
    return scored[:count]
