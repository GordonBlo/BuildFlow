from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.routes.health_routes import router as health_router
from app.routes.project_routes import router as project_router
from app.routes.task_routes import router as task_router
from app import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="BuildFlow API",
    description="Backend API for the BuildFlow construction project and finance management platform.",
    version="0.9.0",
    lifespan=lifespan
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

@app.get("/")
def root():
    return {
        "message": "Welcome to the BuildFlow API",
        "docs": "/docs",
        "health": "/health"
    }

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(project_router)
app.include_router(task_router)
