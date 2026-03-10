const DEMO_TOKEN = "test-token";

async function getItems() {
  const response = await fetch("/api/items", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${DEMO_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch /api/items/: ${response.status}`);
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
          This page fetches <code>/api/items/</code> on the server and renders
          the JSON response below.
        </p>

        <div className="mt-6 rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
          <p className="text-zinc-400">GET /api/items/</p>
          <pre className="mt-3 overflow-x-auto">
            <code>{JSON.stringify(items, null, 2)}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
