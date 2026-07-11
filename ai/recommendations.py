"""LLM-backed project idea generation.

Provider-agnostic: any OpenAI-compatible endpoint works. Configure via .env:

    LLM_API_KEY=...                                  # required
    LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
    LLM_MODEL=gemini-2.5-flash

The defaults target Google Gemini's free tier; switching to OpenAI, Groq, or
GitHub Models only requires changing these three variables.
"""

import json
import os
import time
from typing import Callable, TypeVar

from dotenv import load_dotenv
from openai import OpenAI, RateLimitError

from . import prompts
from .schemas import ProjectIdea

T = TypeVar("T")

DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
DEFAULT_MODEL = "gemini-2.5-flash"

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
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            time.sleep(base_delay * (2**attempt))
    raise AssertionError("unreachable")


def generate_project_ideas(skills: list[str], interests: list[str], count: int = 3) -> list[ProjectIdea]:
    prompt = prompts.PROJECT_RECOMMENDATION_PROMPT.format(
        skills=", ".join(skills) or "none listed",
        interests=", ".join(interests) or "none listed",
        count=count,
    )

    def _request() -> str:
        response = _get_client().chat.completions.create(
            model=_get_model(),
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    data = json.loads(_call_with_retry(_request))
    return [ProjectIdea(**item) for item in data["projects"]]
