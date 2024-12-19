from fastapi import FastAPI
from src.api import ocr_endpoint
from fastapi.middleware.cors import CORSMiddleware
from src.configs.cors_config import CorsSettings

app = FastAPI()

fe_origins = [CorsSettings.FE_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=fe_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_endpoint.router)