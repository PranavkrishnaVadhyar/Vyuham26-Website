import asyncio
from sqlalchemy import text
from app.core.db import engine

statements = [
    "UPDATE events SET makemypass_url = 'https://makemypass.com/event/vyuham26-hackathon', registration_url = 'https://makemypass.com/event/vyuham26-hackathon' WHERE slug = 'hackathon';",
    "UPDATE events SET makemypass_url = 'https://makemypass.com/event/vyuham26-best-manager', registration_url = 'https://makemypass.com/event/vyuham26-best-manager' WHERE slug = 'best-manager';",
    "UPDATE events SET makemypass_url = 'https://makemypass.com/event/vyuham26-valorant', registration_url = 'https://makemypass.com/event/vyuham26-valorant' WHERE slug IN ('valorant', 'valorant-tournament');",
    "UPDATE events SET makemypass_url = 'https://makemypass.com/event/vyuham26-ctf', registration_url = 'https://makemypass.com/event/vyuham26-ctf' WHERE slug IN ('capture-the-flag', 'ctf');",
]

async def main():
    async with engine.begin() as conn:
        for stmt in statements:
            await conn.execute(text(stmt))
    print("Successfully set flagship MakeMyPass URLs in database.")

if __name__ == "__main__":
    asyncio.run(main())
