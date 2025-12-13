# app/config.py
import os
from dataclasses import dataclass

from dotenv import load_dotenv

# Load .env from project root when app starts
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(BASE_DIR, ".env"))

@dataclass
class Settings:
    database_url: str

def get_settings() -> Settings:
    db_url = os.getenv(
        "DATABASE_URL",
        "postgresql://packing_user:packing_pass@localhost:5432/packing_db",
    )
    return Settings(database_url=db_url)
