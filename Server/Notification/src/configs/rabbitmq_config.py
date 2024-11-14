from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
from typing import ClassVar

load_dotenv()
class CorsSettings(BaseSettings):
    RABBITMQ_HOST:ClassVar[str] = str(os.environ['RABBITMQ_HOST'])
    RABBITMQ_PORT:ClassVar[str] = str(os.environ['RABBITMQ_PORT'])

    NOTIFICATION_QUEUE: ClassVar[str] = str(os.environ['RABBITMQ_QUEUE'])
    
RabbitMQConfigs = CorsSettings()