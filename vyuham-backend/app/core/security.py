import logging
from typing import Any
from uuid import UUID

import jwt
from fastapi import HTTPException, status
from jwt import InvalidTokenError, PyJWKClient

from app.core.config import settings


JWKS_URL = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL, cache_keys=True, timeout=5)
ALLOWED_ALGORITHMS = {"HS256", "ES256", "RS256"}
logger = logging.getLogger(__name__)


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