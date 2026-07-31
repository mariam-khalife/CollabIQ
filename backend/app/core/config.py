from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    LLM_API_KEY: str | None = None
    LLM_BASE_URL: str = (
        "https://generativelanguage.googleapis.com/"
        "v1beta/openai/"
    )
    LLM_MODEL: str = "gemini-2.5-flash"

    # Comma-separated list of origins allowed by CORS. Defaults to the local
    # Vite dev server; in production set this to the deployed frontend URL,
    # e.g. "https://collabiq.vercel.app".
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.FRONTEND_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()