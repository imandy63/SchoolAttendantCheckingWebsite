from fastapi import FastAPI
from src.api import notification_endpoint
from src.api import user_endpoint
from src.api import user_endpoint
from src.services.schedule_service import ScheduleService 
from src.middlewares.token_validate_middleware import TokenValiddateMiddleware
from fastapi.middleware.cors import CORSMiddleware
from src.configs.cors_config import CorsSettings
from src.utils.worker import launchThread

app = FastAPI()
app.add_middleware(TokenValiddateMiddleware)

fe_origins = [CorsSettings.FE_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=fe_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notification_endpoint.router)
app.include_router(user_endpoint.router)

@app.on_event("startup")
async def startup_event():
    ScheduleService.start_scheduler()
    launchThread()
