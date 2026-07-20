from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from app.core.config import settings

from sqlalchemy import create_engine, text

# Handle Render's `postgres://` URLs (SQLAlchemy requires `postgresql://`)
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)

if settings.DATABASE_URL.startswith("postgresql"):
    try:
        temp_engine = create_engine(
            settings.DATABASE_URL,
            pool_size=5,
            max_overflow=0,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 2}
        )
        with temp_engine.connect() as conn:
            # Automatically try to enable PostGIS on Render managed DBs
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.commit()
            except Exception as e:
                print(f"[INFO] PostGIS extension check: {e}")
            pass
        engine = temp_engine
    except Exception as e:
        print(f"[WARN] PostgreSQL connection failed ({e}). Automatically falling back to local SQLite demo database (crimevista_demo.db)...")
        settings.DATABASE_URL = "sqlite:///./crimevista_demo.db"

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in settings.DATABASE_URL:
        engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, poolclass=StaticPool)
    else:
        engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Auto-initialize tables and seed demo data on startup for both PostgreSQL and local SQLite databases
if ":memory:" not in settings.DATABASE_URL:
    try:
        from scripts.seed_network_data import seed_network
        seed_network()
    except Exception as e:
        print(f"[INFO] Auto-seeding check check: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
