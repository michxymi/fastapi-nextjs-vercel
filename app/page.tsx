import { headers } from "next/headers";

const ITEMS_PATH = "/api/v1/items";
const DUMMY_BEARER_TOKEN = process.env.DEMO_BEARER_TOKEN ?? "demo-token-123";

interface ItemsResponse {
  token: string;
}

async function getBaseUrl() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    process.env.VERCEL_URL ??
    "127.0.0.1:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("127.0.0.1") || host.startsWith("localhost")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
}

async function getItems() {
  const requestHeaders = await headers();
  const baseUrl = await getBaseUrl();
  const cookie = requestHeaders.get("cookie");
  const response = await fetch(new URL(ITEMS_PATH, baseUrl), {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${DUMMY_BEARER_TOKEN}`,
      ...(cookie ? { cookie } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${ITEMS_PATH}: ${response.status}`);
  }

  return (await response.json()) as ItemsResponse;
}

export default async function Home() {
  const items = await getItems();
  const authorizationHeader = `Bearer ${DUMMY_BEARER_TOKEN}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-950">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="font-semibold text-3xl tracking-tight">
          FastAPI items example
        </h1>
        <p className="mt-3 text-zinc-600 leading-7">
          This page fetches <code>{ITEMS_PATH}</code> on the server with{" "}
          <code>{`Authorization: ${authorizationHeader}`}</code> and renders the
          JSON response below.
        </p>
        <p className="mt-3 text-zinc-600 leading-7">
          The proxy in <code>next.config.ts</code> is a rewrite, so the request
          stays on the Next.js server and the auth header is forwarded to
          FastAPI. A browser redirect would be more likely to drop it.
        </p>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-700">
          <p className="font-medium text-zinc-950">Request header</p>
          <code className="mt-2 block overflow-x-auto">{`Authorization: ${authorizationHeader}`}</code>
        </div>

        <div className="mt-6 rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
          <p className="text-zinc-400">GET {ITEMS_PATH}</p>
          <pre className="mt-3 overflow-x-auto">
            <code>{JSON.stringify(items, null, 2)}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
