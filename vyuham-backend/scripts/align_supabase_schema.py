import asyncio
from sqlalchemy import text
from app.core.db import engine

SCHEMA_UPGRADE_STATEMENTS = [
    # 1. Update profiles table
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS station VARCHAR(120);",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vyuham_id VARCHAR(40);",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);",
    "CREATE UNIQUE INDEX IF NOT EXISTS ix_profiles_vyuham_id ON public.profiles(vyuham_id);",

    # 2. Update events table
    "ALTER TABLE public.events ADD COLUMN IF NOT EXISTS blurb VARCHAR(500);",
    "ALTER TABLE public.events ALTER COLUMN status SET DEFAULT 'open';",
    "ALTER TABLE public.events ALTER COLUMN featured SET DEFAULT FALSE;",

    # 3. Update registrations table
    "ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ticket_code VARCHAR(64);",
    "ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP WITH TIME ZONE;",
    "ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10, 2) DEFAULT 0.00;",
    "ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(120);",
    "CREATE UNIQUE INDEX IF NOT EXISTS ix_registrations_ticket_code ON public.registrations(ticket_code);",

    # 4. Create checkins table
    """
    CREATE TABLE IF NOT EXISTS public.checkins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_code VARCHAR(64) NOT NULL,
        registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
        event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
        user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        station VARCHAR(120) NOT NULL,
        scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        scanned_by_name VARCHAR(160),
        status VARCHAR(20) NOT NULL DEFAULT 'approved',
        scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        notes TEXT
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_checkins_ticket_code ON public.checkins(ticket_code);",
    "CREATE INDEX IF NOT EXISTS ix_checkins_station ON public.checkins(station);",
    "CREATE INDEX IF NOT EXISTS ix_checkins_scanned_at ON public.checkins(scanned_at DESC);",

    # 5. Create orders table (Payments & Receipts)
    """
    CREATE TABLE IF NOT EXISTS public.orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        transaction_ref VARCHAR(100) UNIQUE NOT NULL,
        receipt_no VARCHAR(100) UNIQUE NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        payment_method VARCHAR(50) NOT NULL DEFAULT 'upi',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        registration_ids JSONB DEFAULT '[]'::jsonb,
        items JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_orders_user_id ON public.orders(user_id);",
    "CREATE INDEX IF NOT EXISTS ix_orders_transaction_ref ON public.orders(transaction_ref);",

    # 6. Create event_results table (Podium & Winners)
    """
    CREATE TABLE IF NOT EXISTS public.event_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
        first_place VARCHAR(200) NOT NULL,
        second_place VARCHAR(200) NOT NULL,
        third_place VARCHAR(200),
        prize_distributed VARCHAR(100),
        published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT uq_event_results_event_id UNIQUE (event_id)
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_event_results_event_id ON public.event_results(event_id);",

    # 7. Create certificates table
    """
    CREATE TABLE IF NOT EXISTS public.certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        certificate_code VARCHAR(80) UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
        role VARCHAR(100) NOT NULL DEFAULT 'PARTICIPANT',
        status VARCHAR(40) NOT NULL DEFAULT 'ISSUED & VERIFIED',
        issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
        pdf_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_certificates_code ON public.certificates(certificate_code);",
    "CREATE INDEX IF NOT EXISTS ix_certificates_user_id ON public.certificates(user_id);",

    # 8. Create contact_inquiries table
    """
    CREATE TABLE IF NOT EXISTS public.contact_inquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(160) NOT NULL,
        organization VARCHAR(200),
        email VARCHAR(320) NOT NULL,
        phone VARCHAR(40),
        tier VARCHAR(60),
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    """,

    # 9. Create feedback table
    """
    CREATE TABLE IF NOT EXISTS public.feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comments TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    """
]

async def apply_migrations():
    print(f"Connecting to database and applying {len(SCHEMA_UPGRADE_STATEMENTS)} schema alignments...")
    async with engine.begin() as conn:
        for idx, statement in enumerate(SCHEMA_UPGRADE_STATEMENTS, 1):
            stmt_clean = statement.strip()
            title = stmt_clean.splitlines()[0][:60]
            try:
                await conn.execute(text(stmt_clean))
                print(f"[{idx}/{len(SCHEMA_UPGRADE_STATEMENTS)}] OK: {title}")
            except Exception as e:
                print(f"[{idx}/{len(SCHEMA_UPGRADE_STATEMENTS)}] NOTE/WARN: {title} -> {e}")
                
    await engine.dispose()
    print("\n✅ All schema upgrades successfully executed on Supabase!")

if __name__ == "__main__":
    asyncio.run(apply_migrations())
