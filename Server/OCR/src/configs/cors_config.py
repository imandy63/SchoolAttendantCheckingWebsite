from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
from typing import ClassVar

load_dotenv()
class CorsSettings(BaseSettings):
    FE_URL:ClassVar[str] = str(os.environ['FE_URL'])
    
CorsConfigs = CorsSettings()