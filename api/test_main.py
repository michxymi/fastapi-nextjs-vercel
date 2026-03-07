from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_items_requires_bearer_token():
    response = client.get("/items/")

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_read_items_returns_token_from_authorization_header():
    response = client.get(
        "/items/",
        headers={"Authorization": "Bearer test-token"},
    )

    assert response.status_code == 200
    assert response.json() == {"token": "test-token"}
