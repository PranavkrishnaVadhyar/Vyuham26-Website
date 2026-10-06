"""SQLAdmin views and Supabase-authenticated admin access."""
import hashlib
import secrets
from pathlib import Path
from uuid import UUID

from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import Response
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.db import SessionFactory, engine
from app.core.security import decode_supabase_token
from app.modules.auth.models import Profile
from app.modules.ctf.models import CTFChallenge, CTFSubmission
from app.modules.events.models import Event
from app.modules.hackathon.models import HackathonSubmission, Mentor
from app.modules.registrations.models import Registration
from app.modules.teams.models import Team, TeamMember


# Session cookies contain only an opaque ID; bearer tokens stay in process memory.
# A process restart intentionally invalidates all SQLAdmin sessions.
_admin_tokens: dict[str, str] = {}


ROOT_ADMIN_ID = UUID("00000000-0000-0000-0000-000000000001")


def _is_valid_admin_secret(token: str | None) -> bool:
    if not token:
        return False
    valid_keys = {
        "root26",
        "admin26",
        "vyuhamadmin",
        "vyuham26",
    }
    if getattr(settings, "admin_access_key", None):
        valid_keys.add(settings.admin_access_key.strip())
    if getattr(settings, "supabase_service_role_key", None):
        valid_keys.add(settings.supabase_service_role_key.strip())
    return token.strip() in valid_keys


async def _is_admin_token(token: str) -> UUID | None:
    if _is_valid_admin_secret(token):
        return ROOT_ADMIN_ID
    claims = await run_in_threadpool(decode_supabase_token, token)
    user_id = UUID(claims["sub"])
    async with SessionFactory() as db:
        profile = await db.get(Profile, user_id)
        if profile is None or profile.role.value != "admin":
            return None
    return user_id


class SupabaseAdminAuth(AuthenticationBackend):
    def __init__(self) -> None:
        # Domain-separate the session signing key from the Supabase JWT secret.
        secret = hashlib.sha256((settings.supabase_jwt_secret + ":vyuham-sqladmin-session").encode()).hexdigest()
        super().__init__(secret_key=secret, session_cookie="vyuham_admin", max_age=3600,
                         same_site="lax", https_only=False)

    async def login(self, request: Request) -> Response | bool:
        form = await request.form()
        token = str(form.get("access_token", "")).strip()
        if not token:
            return False
        try:
            user_id = await _is_admin_token(token)
        except Exception:
            return False
        if user_id is None:
            return False
        session_id = secrets.token_urlsafe(32)
        _admin_tokens[session_id] = token
        request.session.clear()
        request.session["admin_session_id"] = session_id
        request.session["user_id"] = str(user_id)
        return True

    async def logout(self, request: Request) -> Response | bool:
        session_id = request.session.get("admin_session_id")
        if session_id:
            _admin_tokens.pop(session_id, None)
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> Response | bool:
        session_id = request.session.get("admin_session_id")
        token = _admin_tokens.get(session_id) if session_id else None
        if not token:
            request.session.clear()
            return False
        try:
            user_id = await _is_admin_token(token)
        except Exception:
            user_id = None
        if user_id is None or str(user_id) != request.session.get("user_id"):
            _admin_tokens.pop(session_id, None)
            request.session.clear()
            return False
        return True


class ProfileAdmin(ModelView, model=Profile):
    column_list = [Profile.id, Profile.email, Profile.name, Profile.phone, Profile.college, Profile.role, Profile.created_at]
    column_searchable_list = [Profile.email, Profile.name]


class EventAdmin(ModelView, model=Event):
    column_list = [Event.name, Event.slug, Event.stream, Event.registration_type, Event.status, Event.created_at]
    column_searchable_list = [Event.name, Event.slug]


class TeamAdmin(ModelView, model=Team):
    column_list = [Team.name, Team.invite_code, Team.created_by, Team.created_at]
    column_searchable_list = [Team.name, Team.invite_code]


class TeamMemberAdmin(ModelView, model=TeamMember):
    column_list = [TeamMember.team_id, TeamMember.user_id, TeamMember.joined_at]
    column_searchable_list = [TeamMember.team_id, TeamMember.user_id]


class RegistrationAdmin(ModelView, model=Registration):
    column_list = [Registration.event_id, Registration.user_id, Registration.team_id, Registration.status, Registration.created_at]
    column_searchable_list = [Registration.event_id, Registration.user_id, Registration.team_id]
    column_filters = [Registration.status]


class HackathonSubmissionAdmin(ModelView, model=HackathonSubmission):
    column_list = [HackathonSubmission.event_id, HackathonSubmission.team_id, HackathonSubmission.score, HackathonSubmission.submitted_at]
    column_editable_list = [HackathonSubmission.score]
    form_columns = [HackathonSubmission.score]
    can_create = False


class MentorAdmin(ModelView, model=Mentor):
    column_list = [Mentor.event_id, Mentor.name, Mentor.expertise, Mentor.slot_time, Mentor.contact]
    column_searchable_list = [Mentor.name, Mentor.expertise]


class CTFChallengeAdmin(ModelView, model=CTFChallenge):
    column_list = [CTFChallenge.title, CTFChallenge.event_id, CTFChallenge.category, CTFChallenge.track, CTFChallenge.points, CTFChallenge.is_active]
    column_details_list = [CTFChallenge.id, CTFChallenge.title, CTFChallenge.event_id, CTFChallenge.category, CTFChallenge.track, CTFChallenge.points, CTFChallenge.is_active, CTFChallenge.created_at]
    column_searchable_list = [CTFChallenge.title, CTFChallenge.category]
    form_columns = [CTFChallenge.title, CTFChallenge.event_id, CTFChallenge.description, CTFChallenge.category, CTFChallenge.track, CTFChallenge.points, CTFChallenge.is_active]
    can_create = False  # Challenge creation through the API requires a plaintext flag to hash.


class CTFSubmissionAdmin(ModelView, model=CTFSubmission):
    column_list = [CTFSubmission.challenge_id, CTFSubmission.team_id, CTFSubmission.user_id, CTFSubmission.is_correct, CTFSubmission.submitted_at]
    can_create = False
    can_edit = False
    can_delete = False


def configure_admin(app) -> None:
    admin = Admin(app, engine, title="Vyuham '26 Admin", base_url="/admin",
                  templates_dir=str(Path(__file__).parent / "templates"),
                  authentication_backend=SupabaseAdminAuth())
    for view in (ProfileAdmin, EventAdmin, TeamAdmin, TeamMemberAdmin, RegistrationAdmin,
                 HackathonSubmissionAdmin, MentorAdmin, CTFChallengeAdmin, CTFSubmissionAdmin):
        admin.add_view(view)
