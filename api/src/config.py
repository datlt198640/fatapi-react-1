from pydantic import BaseSettings
from decouple import config


class Settings(BaseSettings):
    DATABASE_URL: str = config("MONGODB_URL", cast=str)


settings = Settings()

