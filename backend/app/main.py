from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health_routes import router as health_router


app = FastAPI(
    title="BuildFlow API",
    description="Backend API for the BuildFlow construction project and finance management platform.",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
