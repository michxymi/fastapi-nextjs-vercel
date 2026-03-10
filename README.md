# FastAPI-NextJS App Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmichxymi%2Ffastapi-nextjs-vercel)

A minimal full-stack template using [NextJS 16 App Router](https://nextjs.org/docs/app) and [FastAPI](https://fastapi.tiangolo.com/) with a focus on exceptional local development tooling and seamless [Vercel](https://vercel.com/) deployment.

## Modern Tooling

The project uses a modern Python and Typescript toolchain to keep local development fast and maintain a high bar for code quality.

- [uv](https://docs.astral.sh/uv/) for Python package management
- [pnpm](https://pnpm.io/) for NodeJS package management
- [ruff](https://docs.astral.sh/ruff/linter/) and [biome](https://biomejs.dev/) with the [ultracite](https://www.ultracite.ai/) preset
- Typechecking with [tsc](https://www.typescriptlang.org/) and [ty](https://docs.astral.sh/ty/)
- [pre-commit](https://pre-commit.com/) for git hooks
- [vitest](https://vitest.dev/) for UI testing
- [pytest](https://docs.pytest.org/en/stable/) for API testing

## CI/CD

The project includes a simple CI/CD setup for automated checks and fast deployment.

[GitHub Actions](https://github.com/features/actions) runs linting, type checking, and unit tests for both the frontend and API on pull requests and pushes to main.

Deployment is handled by Vercel. On push, the NextJS app is deployed automatically alongside the FastAPI app which is exposed as a serverless function. This makes the template a good fit for quick prototyping and lightweight full-stack projects.

## Project structure

```text
.
|-- .vscode/..............# Recommended plugins and formatting settings
|-- app/                  # NextJS app
|-- api/                  # FastAPI app
|-- .github/workflows/    # CI pipeline
```

## Prerequisites

- uv (Manages Python versions)
- pnpm (Manages Node versions)

## Getting started

Install frontend dependencies:

```bash
pnpm install
```

Install API dependencies:

```bash
uv sync --project api --extra dev
```

Start both apps in development:

```bash
pnpm dev
```

This runs:

- NextJS on `http://localhost:3000`
- FastAPI via `uv run --project api fastapi dev api/main.py`

Open `http://localhost:3000` to see the frontend. The home page fetches and renders the response from `GET /api/v1/items`.

## Available scripts

```bash
pnpm dev              # run NextJS and FastAPI together
pnpm dev:next         # run NextJS only
pnpm dev:fastapi      # run FastAPI only
pnpm build            # production NextJS build
pnpm start            # start built NextJS app
pnpm check            # frontend + backend lint checks
pnpm typecheck        # frontend + backend type checks
pnpm fix              # auto-fix supported lint issues
pnpm test:next        # run frontend tests
```
