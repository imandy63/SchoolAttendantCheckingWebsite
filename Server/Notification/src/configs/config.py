from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import ClassVar
from pathlib import Path

class Settings(BaseSettings):
    BASE_DIR: ClassVar[Path] = Path(__file__).resolve().parent
    FIREBASE_CREDENTIALS: ClassVar[str] = BASE_DIR / 'json' / 'firebase_config.json'

Configs = Settings()
    