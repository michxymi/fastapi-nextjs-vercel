from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_items_requires_bearer_token():
    response = client.get("/api/v1/items/")

    assert response.status_code == 200
    assert response.json() == {"items": ["alpha", "beta", "gamma"]}


def test_read_items_supports_requests_without_trailing_slash():
    response = client.get("/api/v1/items")

    assert response.status_code == 200
    assert response.json() == {"items": ["alpha", "beta", "gamma"]}
