from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CityNerve API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "citynerve"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
