import logging
import json
import time
from typing import Any
from uuid import UUID
from urllib.request import Request as URLRequest, urlopen

import jwt
from fastapi import HTTPException, status
from jwt import InvalidTokenError, PyJWKClient

from app.core.config import settings


JWKS_URL = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL, cache_keys=True, timeout=5)
ALLOWED_ALGORITHMS = {"HS256", "ES256", "RS256"}
logger = logging.getLogger(__name__)
_verified_email_cache: dict[tuple[str, str], float] = {}


def _email_is_verified(token: str, user_id: str, email: str) -> bool:
    """Check GoTrue's canonical user record; Supabase JWTs do not guarantee a verified claim."""
    key = (user_id, email.lower())
    now = time.monotonic()
    if _verified_email_cache.get(key, 0) > now:
        return True
    request = URLRequest(
        f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
        headers={"Authorization": f"Bearer {token}", "apikey": settings.supabase_service_role_key},
    )
    try:
        with urlopen(request, timeout=4) as response:
            user = json.loads(response.read(65536))
        verified = user.get("id") == user_id and user.get("email", "").lower() == email.lower() and bool(
            user.get("email_confirmed_at") or user.get("confirmed_at")
        )
    except Exception as exc:
        logger.warning("Supabase email verification lookup failed (%s)", type(exc).__name__)
        return False
    if verified:
        _verified_email_cache[key] = now + 60
        if len(_verified_email_cache) > 10_000:
            _verified_email_cache.clear()
    return verified


def decode_supabase_token(token: str) -> dict[str, Any]:
    """Verify Supabase JWTs using the legacy HS256 secret or project JWKS keys."""
    try:
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")
        if algorithm not in ALLOWED_ALGORITHMS:
            raise InvalidTokenError("Unsupported JWT signing algorithm")

        if algorithm == "HS256":
            verification_key = settings.supabase_jwt_secret
        else:
            verification_key = jwks_client.get_signing_key_from_jwt(token).key

        issuer = f"{settings.supabase_url.rstrip('/')}/auth/v1"
        payload = jwt.decode(
            token,
            verification_key,
            algorithms=[algorithm],
            issuer=issuer,
            audience="authenticated",
            leeway=30,
            options={"require": ["exp", "sub", "email", "iss"]},
        )
        UUID(payload["sub"])
        if not isinstance(payload["email"], str) or not payload["email"]:
            raise InvalidTokenError("Token email is missing")
        if not _email_is_verified(token, payload["sub"], payload["email"]):
            raise InvalidTokenError("Email address is not verified")
        return payload
    except Exception as exc:
        # Log the reason for server-side diagnosis, but never log the bearer token.
        logger.warning("Supabase JWT verification failed (%s): %s", type(exc).__name__, exc)
        # Do not expose token parsing, signature, expiry, or JWKS fetch details to clients.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
