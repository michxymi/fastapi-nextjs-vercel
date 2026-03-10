import { headers } from "next/headers";

const ITEMS_PATH = "/api/v1/items/";

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
  const baseUrl = await getBaseUrl();
  const response = await fetch(new URL(ITEMS_PATH, baseUrl), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${ITEMS_PATH}: ${response.status}`);
  }

  return response.json();
}

export default async function Home() {
  const items = await getItems();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-950">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="font-semibold text-3xl tracking-tight">
          FastAPI items example
        </h1>
        <p className="mt-3 text-zinc-600 leading-7">
          This page fetches <code>{ITEMS_PATH}</code> on the server and renders
          the JSON response below.
        </p>

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
