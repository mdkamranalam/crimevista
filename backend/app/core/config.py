import os
from pydantic_settings import BaseSettings

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
        env_file = ".env"
        case_sensitive = True

settings = Settings()
