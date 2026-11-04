from functools import lru_cache
from typing import Optional
from urllib.parse import urlsplit

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_role_key: str
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5500,http://127.0.0.1:5500,https://vyuham26-website-staged.vercel.app,https://vyuham26-website-static.vercel.app"
    # Hard kill switch for participant registrations and team entry endpoints.
    registration_enabled: bool = True
    reg_open: Optional[bool] = None
    # Async connection pool ceilings (kept low so this process can never blow
    # Supabase's shared per-project client cap — bursts queue locally via
    # pool_timeout instead of failing with EMXCONNSESSION). In production run
    # a single uvicorn worker so total clients stay comfortably under 15.
    db_pool_size: int = 3
    db_max_overflow: int = 2
    # Optional admin access key. MUST come from the environment (ADMIN_ACCESS_KEY).
    # No hardcoded default on purpose: a default here would be a permanent
    # backdoor. When empty, admin identity is granted only via a Supabase
    # token whose profile role is 'admin'.
    admin_access_key: str = ""

    model_config = SettingsConfigDict(env_file=(".env", "env"), env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_frontend_origins(self) -> list[str]:
        origins: list[str] = []
        for raw_origin in self.frontend_origins.split(","):
            origin = raw_origin.strip().rstrip("/")
            parsed = urlsplit(origin)
            local_http = parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1"}
            secure_https = parsed.scheme == "https"
            if (
                origin
                and "*" not in origin
                and (local_http or secure_https)
                and parsed.hostname
                and not parsed.username
                and not parsed.password
                and parsed.path == ""
                and not parsed.query
                and not parsed.fragment
            ):
                origins.append(origin)
        return list(dict.fromkeys(origins))

    @property
    def async_database_url(self) -> str:
        """Normalize common Supabase/Postgres URL schemes for asyncpg."""
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+asyncpg://" + url[len("postgres://") :]
        if url.startswith("postgresql://"):
            return "postgresql+asyncpg://" + url[len("postgresql://") :]
        return url


_runtime_reg_open: Optional[bool] = None


def set_runtime_registration_open(val: bool) -> None:
    global _runtime_reg_open
    _runtime_reg_open = val


def is_registration_open() -> bool:
    """Fast local fallback for the registration gateway.

    Order: runtime cache (kept in sync with the DB by site_settings) ->
    REG_OPEN env seed -> default open. The authoritative value lives in the
    site_settings DB table; this function is only used when the table cannot
    be read. It deliberately does NOT read frontend source files — that was a
    second, divergent source of truth.
    """
    global _runtime_reg_open
    if _runtime_reg_open is not None:
        return _runtime_reg_open

    val = getattr(settings, "reg_open", None)
    if isinstance(val, bool):
        return val

    return True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

