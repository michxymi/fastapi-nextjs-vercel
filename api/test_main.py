from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_current_user_requires_bearer_token():
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_read_current_user_returns_user():
    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer demo-token-123"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "disabled": None,
        "email": "john@example.com",
        "full_name": "John Doe",
        "username": "demo-token-123fakedecoded",
    }


def test_read_current_user_supports_requests_with_trailing_slash():
    response = client.get(
        "/api/v1/users/me/",
        headers={"Authorization": "Bearer demo-token-123"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "disabled": None,
        "email": "john@example.com",
        "full_name": "John Doe",
        "username": "demo-token-123fakedecoded",
    }
