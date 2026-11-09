# Implementation plan

## Step 0 — Repository foundation (complete)

Goal: reproducible static-first Next.js development, validation, and first CI push.
Files: scaffold, config, rules, tests, tooling, CI, documentation.
Acceptance: lint, strict typecheck, nonzero unit suite, production build, browser smoke pass; commit/tag/push; GitHub CI verified if available.
Risks: owner values unknown; named skill sources may be inaccessible; GitHub API/CI access may differ from Git access.
Decisions: use existing rakhimov-web/project checkout/origin. Node 24 Active LTS, pnpm 11.25.0; pinned Next/React scaffold versions. No backend, payments, or customer screens before their scheduled steps. Placeholder page only. No external font fetch during build; Inter self-hosting belongs to Step 1. Glisse 0.5.0 peer dependencies confirmed >=18 for React and React DOM; installation/gallery belongs to Step 1.
Validation: frozen-lockfile installation repeated successfully; no peer dependency issues. ESLint, strict TypeScript, 2 Vitest unit tests, production build, and 2 Playwright production smoke/axe checks (light/dark) passed. Formatting check passed; source audit found no raw hex outside tokens.css. Development server also started and returned the expected Uzbek scaffold over HTTP. Browser download from cdn.playwright.dev was denied; installed /usr/bin/chromium works using the documented executable override. No external fonts or real backend requests. All seven requested publisher/skills sources failed public resolution/authentication; per-skill statuses and manual fallback scope recorded in SKILLS_STATUS.md. Design references cloned at recorded commit.
Remote completion: foundation commit 17ba354 pushed to origin/main with tag step-00; remote refs verified. First CI run: https://github.com/rakhimov-web/project/actions/runs/42582357807 (completed successfully; all CI checks green on first push, 59s). GitHub API returns Forbidden, but workflow status can be read from GitHub web pages. Cloud configuration: reusable install_script/start_skill draft save attempted; tool returned INVALID_ARGUMENT and persistence remains unconfirmed. Tested setup/start commands are retained in README.md. No screenshots required for Step 0 tooling; visual baselines begin with Step 1 gallery.

## Remaining sequence

1 design tokens/gallery; 2 Telegram shell; 3a–h static customer screens; 4 visual approval gate; 5 database; 6 auth; 7 admin; 8 real data; 9 Stars; 10 video; 11 hardening; 12 launch.
Stop after each step. Backend remains blocked until explicit UI approval at Step 4.
