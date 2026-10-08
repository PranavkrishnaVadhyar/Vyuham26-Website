"""Read-only report of database schema and ORM table/column differences.

Run from the backend directory with:
    python -m scripts.inspect_schema
"""

import argparse
import asyncio
from typing import Any

from sqlalchemy import inspect

from app.core.db import Base, engine
from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.events import models as event_models  # noqa: F401
from app.modules.teams import models as team_models  # noqa: F401
from app.modules.registrations import models as registration_models  # noqa: F401
from app.modules.payments import models as payment_models  # noqa: F401
from app.modules.checkin import models as checkin_models  # noqa: F401
from app.modules.certificates import models as certificate_models  # noqa: F401
from app.modules.hackathon import models as hackathon_models  # noqa: F401
from app.modules.ctf import models as ctf_models  # noqa: F401
from app.modules.announcements import models as announcement_models  # noqa: F401
from app.modules.auxiliary import models as auxiliary_models  # noqa: F401
from app.modules.event_results import models as event_result_models  # noqa: F401


def _format_default(value: Any) -> str:
    return "<none>" if value is None else str(value)


def inspect_schema(connection, schema: str) -> None:
    """Print the database catalog without reading or modifying application rows."""
    inspector = inspect(connection)
    tables = set(inspector.get_table_names(schema=schema))
    database_columns: dict[str, dict[str, dict[str, Any]]] = {}

    print(f"Database schema report: {schema}")
    print(f"Tables found: {len(tables)}\n")

    if not tables:
        print("No tables found in this schema.")

    for table_name in sorted(tables):
        columns = inspector.get_columns(table_name, schema=schema)
        database_columns[table_name] = {column["name"]: column for column in columns}
        print(f"=== {schema}.{table_name} ===")
        for column in columns:
            nullable = "NULL" if column["nullable"] else "NOT NULL"
            default = _format_default(column.get("default"))
            print(f"  COLUMN {column['name']}: {column['type']} | {nullable} | default={default}")

        primary_key = inspector.get_pk_constraint(table_name, schema=schema)
        if primary_key.get("constrained_columns"):
            print(f"  PRIMARY KEY ({', '.join(primary_key['constrained_columns'])})")

        for constraint in inspector.get_unique_constraints(table_name, schema=schema):
            cols = ", ".join(constraint.get("column_names") or [])
            print(f"  UNIQUE {constraint.get('name') or ''} ({cols})")

        for foreign_key in inspector.get_foreign_keys(table_name, schema=schema):
            source = ", ".join(foreign_key.get("constrained_columns") or [])
            target_schema = foreign_key.get("referred_schema") or schema
            target_table = foreign_key.get("referred_table") or "?"
            target_cols = ", ".join(foreign_key.get("referred_columns") or [])
            print(f"  FOREIGN KEY {source} -> {target_schema}.{target_table}({target_cols})")

        for index in inspector.get_indexes(table_name, schema=schema):
            cols = ", ".join(index.get("column_names") or [])
            unique = " UNIQUE" if index.get("unique") else ""
            print(f"  INDEX{unique} {index.get('name') or ''} ({cols})")
        print()

    expected_tables = {
        table_name
        for table_name, table in Base.metadata.tables.items()
        if table.schema in (None, schema)
    }
    missing_tables = expected_tables - tables
    extra_tables = tables - expected_tables
    print("=== ORM comparison ===")
    print(f"ORM tables expected in {schema}: {len(expected_tables)}")
    print(f"Database tables found in {schema}: {len(tables)}")

    if missing_tables:
        print("MISSING TABLES: " + ", ".join(sorted(missing_tables)))
    if extra_tables:
        print("TABLES NOT DECLARED IN ORM: " + ", ".join(sorted(extra_tables)))

    has_column_differences = False
    for table_name in sorted(expected_tables & tables):
        model_table = Base.metadata.tables[table_name]
        expected_columns = set(model_table.columns.keys())
        actual_column_info = database_columns[table_name]
        actual_columns = set(actual_column_info)
        missing_columns = expected_columns - actual_columns
        extra_columns = actual_columns - expected_columns
        if missing_columns or extra_columns:
            has_column_differences = True
            print(f"COLUMN DIFFERENCE {schema}.{table_name}:")
            if missing_columns:
                print("  Missing from database: " + ", ".join(sorted(missing_columns)))
            if extra_columns:
                print("  Not declared in ORM: " + ", ".join(sorted(extra_columns)))
        for column_name in sorted(expected_columns & actual_columns):
            expected_nullable = model_table.columns[column_name].nullable
            actual_nullable = actual_column_info[column_name]["nullable"]
            if expected_nullable != actual_nullable:
                expected = "NULL" if expected_nullable else "NOT NULL"
                actual = "NULL" if actual_nullable else "NOT NULL"
                has_column_differences = True
                print(
                    f"NULLABILITY MISMATCH {schema}.{table_name}.{column_name}: "
                    f"database={actual}, ORM={expected}"
                )

    if not missing_tables and not extra_tables and not has_column_differences:
        print("Table and column names match the registered ORM models.")


async def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect database tables and compare them with ORM models.")
    parser.add_argument("--schema", default="public", help="Database schema to inspect (default: public).")
    args = parser.parse_args()

    try:
        async with engine.connect() as connection:
            await connection.run_sync(inspect_schema, args.schema)
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
