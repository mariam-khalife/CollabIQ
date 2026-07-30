"""
tests/test_teammate_recommendation.py

Executable test coverage for the six scenarios described in the Sprint 5
doc, plus the extra checks the review notes called out (ranking actually
changes with different skills/interests, duplicate/empty-reason/bad-score
detection). Run with: pytest tests/test_teammate_recommendation.py -v
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from backend.app.ai.teammate_recommendation import (
    Candidate,
    ProjectRequirements,
    filter_eligible_candidates,
    score_candidate,
    recommend_teammates,
    validate_recommendation_output,
    RecommendationValidationError,
    MAX_RECOMMENDATIONS,
)


# ---------------------------------------------------------------------
# Scenario 1: Strong backend match
# ---------------------------------------------------------------------

def test_scenario_1_strong_backend_match():
    req = ProjectRequirements(
        missing_role="Backend Developer",
        required_skills={"Python", "FastAPI", "PostgreSQL"},
    )
    strong = Candidate("1", "Alice", "Backend Developer",
                        skills={"Python", "FastAPI", "PostgreSQL"})
    weak = Candidate("2", "Bob", "Frontend Developer",
                      skills={"React", "CSS"})

    results = recommend_teammates([strong, weak], req)
    assert results[0]["user_id"] == "1"
    assert results[0]["compatibility_score"] > 0.8


# ---------------------------------------------------------------------
# Scenario 2: Frontend match
# ---------------------------------------------------------------------

def test_scenario_2_frontend_match():
    req = ProjectRequirements(
        missing_role="Frontend Developer",
        required_skills={"React", "JavaScript", "Tailwind CSS"},
    )
    candidate = Candidate("3", "Carla", "Frontend Developer",
                           skills={"React", "Tailwind CSS", "JavaScript"})
    results = recommend_teammates([candidate], req)
    assert results[0]["role"] == "Frontend Developer"
    assert results[0]["compatibility_score"] > 0.8


# ---------------------------------------------------------------------
# Scenario 3: Different interests -> ranking must actually change
# ---------------------------------------------------------------------

def test_scenario_3_ranking_changes_with_different_interests():
    req = ProjectRequirements(
        missing_role="AI Engineer",
        required_skills={"Python", "Machine Learning"},
        required_interests={"Artificial Intelligence"},
    )
    matching = Candidate("4", "Dana", "AI Engineer",
                          skills={"Python", "Machine Learning"},
                          interests={"Artificial Intelligence"})
    mismatched = Candidate("5", "Evan", "AI Engineer",
                            skills={"Python", "Machine Learning"},
                            interests={"Cybersecurity"})

    score_matching = score_candidate(matching, req)
    score_mismatched = score_candidate(mismatched, req)

    assert score_matching > score_mismatched, (
        "Interest mismatch should measurably lower the score"
    )

    results = recommend_teammates([mismatched, matching], req)
    assert results[0]["user_id"] == "4"  # correctly re-ranked above mismatch


def test_ranking_changes_with_different_skills():
    req = ProjectRequirements(missing_role="Backend Developer",
                              required_skills={"Python", "FastAPI", "PostgreSQL"})
    full_match = Candidate("6", "Fay", "Backend Developer",
                            skills={"Python", "FastAPI", "PostgreSQL"})
    partial_match = Candidate("7", "Gus", "Backend Developer",
                               skills={"Python"})

    s1 = score_candidate(full_match, req)
    s2 = score_candidate(partial_match, req)
    assert s1 > s2


# ---------------------------------------------------------------------
# Scenario 4: Existing team member excluded
# ---------------------------------------------------------------------

def test_scenario_4_existing_member_excluded():
    req = ProjectRequirements(missing_role="Backend Developer")
    member = Candidate("8", "Hana", "Backend Developer", is_existing_member=True)
    eligible = filter_eligible_candidates([member])
    assert eligible == []

    results = recommend_teammates([member], req)
    assert results == []


# ---------------------------------------------------------------------
# Scenario 5: Pending invitation excluded
# ---------------------------------------------------------------------

def test_scenario_5_pending_invitation_excluded():
    req = ProjectRequirements(missing_role="Backend Developer")
    pending = Candidate("9", "Ivan", "Backend Developer", has_pending_invitation=True)
    eligible = filter_eligible_candidates([pending])
    assert eligible == []


# ---------------------------------------------------------------------
# Scenario 6: Team Leader excluded
# ---------------------------------------------------------------------

def test_scenario_6_team_leader_excluded():
    req = ProjectRequirements(missing_role="Backend Developer")
    leader = Candidate("10", "Jill", "Backend Developer", is_team_leader=True)
    eligible = filter_eligible_candidates([leader])
    assert eligible == []


# ---------------------------------------------------------------------
# Maximum five enforced even with many eligible candidates
# ---------------------------------------------------------------------

def test_max_five_recommendations_enforced():
    req = ProjectRequirements(missing_role="Backend Developer",
                              required_skills={"Python"})
    candidates = [
        Candidate(str(i), f"Cand{i}", "Backend Developer", skills={"Python"})
        for i in range(20)
    ]
    results = recommend_teammates(candidates, req)
    assert len(results) == MAX_RECOMMENDATIONS


def test_fewer_than_five_eligible_returns_all_available():
    req = ProjectRequirements(missing_role="Backend Developer", required_skills={"Python"})
    candidates = [
        Candidate(str(i), f"Cand{i}", "Backend Developer", skills={"Python"})
        for i in range(3)
    ]
    results = recommend_teammates(candidates, req)
    assert len(results) == 3


# ---------------------------------------------------------------------
# Structured output shape matches backend contract exactly
# ---------------------------------------------------------------------

def test_structured_output_matches_backend_format():
    req = ProjectRequirements(missing_role="Backend Developer", required_skills={"Python"})
    candidate = Candidate("11", "Kim", "Backend Developer", skills={"Python"})
    results = recommend_teammates([candidate], req)

    expected_fields = {"user_id", "name", "role", "compatibility_score", "reason"}
    assert set(results[0].keys()) == expected_fields
    assert isinstance(results[0]["compatibility_score"], float)
    assert isinstance(results[0]["reason"], str)


# ---------------------------------------------------------------------
# Validation catches the exact bug classes flagged in review
# ---------------------------------------------------------------------

def test_validation_rejects_duplicate_user_ids():
    fake_results = [
        {"user_id": "1", "name": "A", "role": "Backend", "compatibility_score": 0.9, "reason": "x"},
        {"user_id": "1", "name": "A2", "role": "Backend", "compatibility_score": 0.8, "reason": "y"},
    ]
    eligible = [Candidate("1", "A", "Backend")]
    with pytest.raises(RecommendationValidationError, match="Duplicate"):
        validate_recommendation_output(fake_results, eligible)


def test_validation_rejects_empty_reason():
    fake_results = [
        {"user_id": "1", "name": "A", "role": "Backend", "compatibility_score": 0.9, "reason": "   "},
    ]
    eligible = [Candidate("1", "A", "Backend")]
    with pytest.raises(RecommendationValidationError, match="Empty reason"):
        validate_recommendation_output(fake_results, eligible)


def test_validation_rejects_out_of_range_score():
    fake_results = [
        {"user_id": "1", "name": "A", "role": "Backend", "compatibility_score": 1.5, "reason": "x"},
    ]
    eligible = [Candidate("1", "A", "Backend")]
    with pytest.raises(RecommendationValidationError, match="out of range"):
        validate_recommendation_output(fake_results, eligible)


def test_validation_rejects_bad_ranking_order():
    fake_results = [
        {"user_id": "1", "name": "A", "role": "Backend", "compatibility_score": 0.5, "reason": "x"},
        {"user_id": "2", "name": "B", "role": "Backend", "compatibility_score": 0.9, "reason": "y"},
    ]
    eligible = [Candidate("1", "A", "Backend"), Candidate("2", "B", "Backend")]
    with pytest.raises(RecommendationValidationError, match="not sorted"):
        validate_recommendation_output(fake_results, eligible)


def test_validation_rejects_excluded_user_leaking_into_output():
    fake_results = [
        {"user_id": "99", "name": "Leaked", "role": "Backend", "compatibility_score": 0.9, "reason": "x"},
    ]
    eligible = [Candidate("1", "A", "Backend")]  # "99" was never eligible
    with pytest.raises(RecommendationValidationError, match="not in the eligible pool"):
        validate_recommendation_output(fake_results, eligible)


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))
