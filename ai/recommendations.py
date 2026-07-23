"""LLM-backed project idea generation.

Provider-agnostic: any OpenAI-compatible endpoint works. Configure via .env:

    LLM_API_KEY=...                                  # required
    LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
    LLM_MODEL=gemini-2.5-flash

The defaults target Google Gemini's free tier; switching to OpenAI, Groq, or
GitHub Models only requires changing these three variables.
"""

import os
import time
from typing import Callable, TypeVar

from dotenv import load_dotenv
from openai import APIConnectionError, InternalServerError, OpenAI, RateLimitError

from models.constants import DIFFICULTY_LEVELS

from . import prompts
from .schemas import ProjectIdea, ProjectIdeaList

T = TypeVar("T")

DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
DEFAULT_MODEL = "gemini-2.5-flash"

# Transient provider failures worth retrying; anything else fails fast.
TRANSIENT_ERRORS = (RateLimitError, APIConnectionError, InternalServerError)

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        load_dotenv()
        api_key = os.environ.get("LLM_API_KEY")
        if not api_key:
            raise RuntimeError("LLM_API_KEY is not set - add it to your .env file")
        _client = OpenAI(api_key=api_key, base_url=os.environ.get("LLM_BASE_URL", DEFAULT_BASE_URL))
    return _client


def _get_model() -> str:
    return os.environ.get("LLM_MODEL", DEFAULT_MODEL)


def _call_with_retry(fn: Callable[[], T], *, max_retries: int = 3, base_delay: float = 2.0) -> T:
    for attempt in range(max_retries):
        try:
            return fn()
        except TRANSIENT_ERRORS:
            if attempt == max_retries - 1:
                raise
            time.sleep(base_delay * (2**attempt))
    raise AssertionError("unreachable")


def generate_project_ideas(
    skills: list[str], interests: list[str], experience_levels: list[str] | None = None, count: int = 5
) -> list[ProjectIdea]:
    prompt = prompts.PROJECT_RECOMMENDATION_PROMPT.format(
        skills=", ".join(skills) or "none listed",
        interests=", ".join(interests) or "none listed",
        experience_levels=", ".join(experience_levels or []) or "not specified",
        difficulty_values=", ".join(f'"{level}"' for level in DIFFICULTY_LEVELS),
        count=count,
    )

    def _request() -> str | None:
        response = _get_client().chat.completions.create(
            model=_get_model(),
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    content = _call_with_retry(_request)
    if not content:
        raise RuntimeError("LLM returned an empty response (possibly blocked by a safety filter)")

    # Validates the whole envelope in one place: shape, field types, difficulty
    # vocabulary, and column length limits - nothing unvalidated reaches the caller.
    return ProjectIdeaList.model_validate_json(content).projects
