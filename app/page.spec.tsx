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

  it("renders the fetched items and forwards request cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => [{ id: 1, name: "Test item" }],
      ok: true,
    });

    vi.stubGlobal("fetch", fetchMock);

    const page = await Home();
    const html = renderToStaticMarkup(page);

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("/api/v1/items/", "https://example.com"),
      {
        cache: "no-store",
        headers: { cookie: "session=abc123" },
      }
    );
    expect(html).toContain("FastAPI items example");
    expect(html).toContain("GET /api/v1/items/");
    expect(html).toContain("Test item");
  });
});
