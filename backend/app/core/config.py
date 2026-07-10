from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CityNerve API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
