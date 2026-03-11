from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_items_requires_bearer_token():
    response = client.get("/api/v1/items")

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_read_items_returns_bearer_token():
    response = client.get(
        "/api/v1/items",
        headers={"Authorization": "Bearer demo-token-123"},
    )

    assert response.status_code == 200
    assert response.json() == {"token": "demo-token-123"}


def test_read_items_supports_requests_with_trailing_slash():
    response = client.get(
        "/api/v1/items/",
        headers={"Authorization": "Bearer demo-token-123"},
    )

    assert response.status_code == 200
    assert response.json() == {"token": "demo-token-123"}
