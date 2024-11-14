from pydantic_settings import BaseSettings
import os
from typing import ClassVar

class APISettings(BaseSettings):
    AUTH_DOMAIN: ClassVar[str] = os.environ['AUTH_DOMAIN']

api_domain = APISettings()

    