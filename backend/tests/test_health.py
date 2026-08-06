import os


os.environ["BUILDFLOW_SECRET_KEY"] = "buildflow-test-only-secret-key"

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the BuildFlow API",
        "docs": "/docs",
        "health": "/health",
    }


def test_health_endpoint() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "message": "BuildFlow API is running",
        "version": "1.0.0",
    }
