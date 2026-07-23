import uuid

from ai.matching import CandidateProfile, rank_candidates, score_candidate


def test_full_match_scores_one():
    skill_a = uuid.uuid4()
    skill_b = uuid.uuid4()
    candidate = CandidateProfile(
        user_id=uuid.uuid4(),
        skills={skill_a: "advanced", skill_b: "advanced"},
    )

    result = score_candidate([skill_a, skill_b], candidate)

    assert result.match_score == 1.0


def test_missing_skills_score_zero():
    skill_a = uuid.uuid4()
    candidate = CandidateProfile(user_id=uuid.uuid4(), skills={})

    result = score_candidate([skill_a], candidate)

    assert result.match_score == 0.0
    assert result.suggested_skill_id is None


def test_partial_match_is_proportional_to_proficiency():
    skill_a = uuid.uuid4()
    skill_b = uuid.uuid4()
    candidate = CandidateProfile(
        user_id=uuid.uuid4(),
        skills={skill_a: "beginner", skill_b: "advanced"},
    )

    result = score_candidate([skill_a, skill_b], candidate)

    # (1 + 3) / (2 * 3) = 0.67
    assert result.match_score == 0.67
    assert result.suggested_skill_id == skill_b


def test_no_required_skills_scores_zero():
    candidate = CandidateProfile(user_id=uuid.uuid4(), skills={uuid.uuid4(): "advanced"})

    result = score_candidate([], candidate)

    assert result.match_score == 0.0


def test_rank_candidates_orders_by_score_and_respects_count():
    skill_a = uuid.uuid4()
    weak = CandidateProfile(user_id=uuid.uuid4(), skills={skill_a: "beginner"})
    strong = CandidateProfile(user_id=uuid.uuid4(), skills={skill_a: "advanced"})
    unrelated = CandidateProfile(user_id=uuid.uuid4(), skills={uuid.uuid4(): "advanced"})

    results = rank_candidates([skill_a], [weak, strong, unrelated], count=2)

    assert len(results) == 2
    assert results[0].user_id == strong.user_id
    assert results[1].user_id == weak.user_id
