# AI & Coding Courses — Telegram Mini App

Step 0 foundation: Next.js App Router, React, strict TypeScript, Tailwind, pnpm, ESLint/Prettier, Husky/lint-staged, Vitest, Playwright and axe. Customer screens, Telegram integration, backend and payments are intentionally scheduled for later steps. The current page is a static scaffold.

## Development

Use Node 24 (Active LTS) and pnpm 11.25.0 (`corepack enable` if pnpm is not already installed).

```sh
cd /workspace/project
pnpm install --frozen-lockfile
pnpm dev
```

No secrets, database, bot or `.env` file are needed for the static scaffold. Public owner placeholders live in `src/config/brand.ts` and `.env.example`; copy the example to `.env.local` if customizing. Admin IDs remain server-only. Never put bot tokens in public variables.

If the cloud home directory is read-only, export writable cache/config paths before running pnpm commands:

```sh
export XDG_DATA_HOME=/tmp/codex-data XDG_CACHE_HOME=/tmp/codex-cache XDG_CONFIG_HOME=/tmp/codex-config
pnpm install --frozen-lockfile
```

## Validation

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
PLAYWRIGHT_BROWSERS_PATH=/tmp/playwright pnpm exec playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/tmp/playwright pnpm test:e2e
pnpm format:check
```

If browser downloads are blocked and Chromium is installed, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e` instead.

Browser tests start the production server themselves; stop any process using port 3000 first. On a fresh Linux host, use `pnpm exec playwright install --with-deps chromium` to install browser system dependencies. Keep `PLAYWRIGHT_BROWSERS_PATH` identical for browser installation and test execution. CI installs these dependencies and runs all checks. Tests cover public configuration plus production page rendering, runtime errors, Uzbek document language, and axe accessibility in light/dark modes. They do not establish Telegram or checkout behavior.

`pnpm typecheck` generates Next route types before TypeScript, so it works before the first build. `pnpm test` is a one-shot unit run. `pnpm format` applies Prettier. Pre-commit hooks run ESLint and formatting only on staged files. Dependencies are locked in `pnpm-lock.yaml`.

## Project map and next steps

- `src/app/`: static application entry.
- `src/config/brand.ts`: public owner configuration.
- `src/styles/tokens.css`: minimal scaffold tokens; full design system in Step 1.
- `tests/unit/`, `tests/e2e/`: validation.
- `AGENTS.md`: working rules; `PLANS.md`: scope, decisions and evidence.
- `SKILLS_STATUS.md`: actual skill discovery results and manual fallbacks.
- `docs/MASTER_PROMPT.md`: supplied product brief, retained as reference.
- `.github/workflows/ci.yml`: lint/typecheck/test/build/browser CI on main and pull requests.

Design packs: `git clone --depth 1 https://github.com/Meliwat/awesome-ios-design-md.git /tmp/ios-design-md`. If already present, inspect and reuse; never blindly overwrite it. Full DESIGN.md composition and Glisse 0.5.0 gallery are Step 1. Static UI approval at Step 4 gates backend development. Digital course payments will use Telegram Stars only, after current official documentation is checked.

Production deployment, domain, BotFather, Neon and secret setup belong to later steps. There is no production deployment yet.

## Step 1 — Design foundation

Open the local application's `/dev/gallery` route after `pnpm dev`. The gallery demonstrates all nine actual Glisse 0.5.0 exports, shared primitives, themes, disabled/loading/empty/error states, a Vaul sheet and Sonner feedback. Nothing calls a backend. Use the moon/sun control to switch theme; “Solid material” demonstrates the fallback, and OS reduced-transparency takes precedence.

`DESIGN.md` explains the nine-part system and known vendor limits; `src/styles/tokens.css` holds values. `pnpm lint` includes `lint:design`, which rejects source hex colors outside tokens and untokenized CSS radius/shadow/motion values. Dependencies' styles are third-party code and are not rewritten.

Regenerate the six mobile screenshots and overlay samples:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium CAPTURE_SCREENS=1 pnpm test:e2e
```

Images are retained under `docs/screens/step-01/`. On systems using Playwright's downloaded browser, omit the executable override. Browser tests check controls, keyboard navigation, focus, range values, sheet return focus, named error fields, disabled groups, both themes, minimum targets, overflow, axe and forced material/motion preferences. Real Telegram/Android device behavior is not certified by this browser gallery.
