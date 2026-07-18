import os
import socket
from pathlib import Path
from urllib.parse import urlparse
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    PROJECT_NAME: str = "CrimeVista"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Default matches docker-compose setup in infra/docker-compose.yml
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://crimevista_user:crimevista_password@localhost:5432/crimevista"
    )

    class Config:
        env_file = str(BASE_DIR / ".env")
        case_sensitive = True
        extra = "ignore"

settings = Settings()

# Verify database reachability right on startup; if PostgreSQL is not running locally, auto-switch to SQLite demo database
if settings.DATABASE_URL.startswith("postgresql"):
    try:
        parsed = urlparse(settings.DATABASE_URL)
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432
        with socket.create_connection((host, port), timeout=1.5):
            pass
    except OSError as e:
        print(f"[INFO] PostgreSQL not running at {host}:{port}. Auto-switching to local SQLite demo DB (`crimevista_demo.db`)...")
        settings.DATABASE_URL = "sqlite:///./crimevista_demo.db"
        os.environ["DATABASE_URL"] = settings.DATABASE_URL
