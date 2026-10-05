import re
from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_role_key: str
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5500,http://127.0.0.1:5500"
    reg_open: Optional[bool] = None

    model_config = SettingsConfigDict(env_file=(".env", "env"), env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_frontend_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]

    @property
    def async_database_url(self) -> str:
        """Normalize common Supabase/Postgres URL schemes for asyncpg."""
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+asyncpg://" + url[len("postgres://") :]
        if url.startswith("postgresql://"):
            return "postgresql+asyncpg://" + url[len("postgresql://") :]
        return url


def is_registration_open() -> bool:
    """
    Check if registration is open based on the single source of truth in site.ts.
    Defaults strictly to False (CLOSED) if missing, unreadable, or undefined.
    """
    # 1. Search for frontend site.ts config file
    candidate_paths = [
        Path(__file__).resolve().parents[3] / "Vyuham26_frontend" / "src" / "config" / "site.ts",
        Path(__file__).resolve().parents[3] / "src" / "config" / "site.ts",
        Path.cwd() / "Vyuham26_frontend" / "src" / "config" / "site.ts",
        Path.cwd() / "src" / "config" / "site.ts",
        Path.cwd().parent / "Vyuham26_frontend" / "src" / "config" / "site.ts",
    ]
    for path in candidate_paths:
        if path.is_file():
            try:
                content = path.read_text(encoding="utf-8")
                match = re.search(r"REG_OPEN\s*:\s*(true|false)", content, re.IGNORECASE)
                if match:
                    return match.group(1).lower() == "true"
            except Exception:
                pass

    # 2. Check settings / env override if provided
    try:
        val = getattr(settings, "reg_open", None)
        if isinstance(val, bool):
            return val
    except Exception:
        pass

    return False


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

