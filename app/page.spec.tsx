import { headers } from "next/headers";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("app/page", () => {
  beforeEach(() => {
    vi.mocked(headers).mockResolvedValue(
      new Headers({
        cookie: "session=abc123",
        host: "example.com",
        "x-forwarded-proto": "https",
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders the current user and forwards auth and request cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        disabled: null,
        email: "john@example.com",
        full_name: "John Doe",
        username: "demo-token-123fakedecoded",
      }),
      ok: true,
    });

    vi.stubGlobal("fetch", fetchMock);

    const page = await Home();
    const html = renderToStaticMarkup(page);

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("/api/v1/users/me", "https://example.com"),
      {
        cache: "no-store",
        headers: {
          authorization: "Bearer demo-token-123",
          cookie: "session=abc123",
        },
      }
    );
    expect(html).toContain("Current user");
    expect(html).toContain("Signed in as");
    expect(html).toContain("John Doe");
    expect(html).toContain("john@example.com");
    expect(html).toContain("demo-token-123fakedecoded");
    expect(html).toContain("GET /api/v1/users/me");
  });
});
