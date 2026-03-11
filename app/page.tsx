import { headers } from "next/headers";

const CURRENT_USER_PATH = "/api/v1/users/me";
const DUMMY_BEARER_TOKEN = process.env.DEMO_BEARER_TOKEN ?? "demo-token-123";

interface CurrentUserResponse {
  disabled: boolean | null;
  email: string | null;
  full_name: string | null;
  username: string;
}

type RequestHeaders = Pick<Headers, "get">;

function getBaseUrl(requestHeaders: RequestHeaders) {
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

async function getCurrentUser() {
  const requestHeaders = await headers();
  const baseUrl = getBaseUrl(requestHeaders);
  const cookie = requestHeaders.get("cookie");
  const response = await fetch(new URL(CURRENT_USER_PATH, baseUrl), {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${DUMMY_BEARER_TOKEN}`,
      ...(cookie ? { cookie } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${CURRENT_USER_PATH}: ${response.status}`);
  }

  return (await response.json()) as CurrentUserResponse;
}

export default async function Home() {
  const currentUser = await getCurrentUser();
  const authorizationHeader = `Bearer ${DUMMY_BEARER_TOKEN}`;
  const userDetails = [
    { label: "Username", value: currentUser.username },
    { label: "Full name", value: currentUser.full_name ?? "Not provided" },
    { label: "Email", value: currentUser.email ?? "Not provided" },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-950">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="font-semibold text-3xl tracking-tight">Current user</h1>
        <p className="mt-3 text-zinc-600 leading-7">
          This page fetches <code>{CURRENT_USER_PATH}</code> on the server with{" "}
          <code>{`Authorization: ${authorizationHeader}`}</code> and renders the
          authenticated user returned by FastAPI.
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

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="font-medium text-sm text-zinc-500 uppercase tracking-[0.2em]">
            Signed in as
          </p>
          <p className="mt-3 font-semibold text-2xl text-zinc-950">
            {currentUser.full_name ?? currentUser.username}
          </p>
          <p className="mt-1 text-zinc-600">
            {currentUser.email ?? "No email on file"}
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {userDetails.map((detail) => (
              <div
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                key={detail.label}
              >
                <dt className="text-sm text-zinc-500">{detail.label}</dt>
                <dd className="mt-2 font-medium text-zinc-950">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
          <p className="text-zinc-400">GET {CURRENT_USER_PATH}</p>
          <pre className="mt-3 overflow-x-auto">
            <code>{JSON.stringify(currentUser, null, 2)}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
