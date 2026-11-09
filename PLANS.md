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

## Step 1 — Design foundation (implementation and local verification complete)

Goal: one iOS palette and reusable accessible primitives, with the exact Glisse 0.5.0 controls demonstrated at /dev/gallery.
Files: DESIGN.md, tokens/styles, UI primitives and Glisse adapters, gallery, lint guard and tests, six mobile screenshots.
Acceptance: all shipped Glisse controls exercised; light/dark, keyboard, disabled/loading/empty/error and solid fallback states; lint/typecheck/unit/build/browser checks; inspect six mobile screenshots; commit/tag/push.
Risks: pre-1.0 Glisse accessibility/API limitations must be verified from installed types/source and corrected in adapters where possible. No backend or Telegram shell in this step. Named unavailable skills use documented manual patterns.

Validation: frozen-lockfile install, formatting, lint/design guard, strict typecheck, 3 unit tests, production build and 12 Chromium browser tests passed. Browser checks include all six mobile/theme combinations, axe on gallery/menu/sheet, minimum 44px targets, no horizontal overflow, keyboard selection/focus, slider/search behavior, disabled/busy states, sheet focus return and OS motion/transparency plus unsupported-backdrop fallback. Six full-page mobile screenshots and menu/sheet samples saved in docs/screens/step-01 and visually inspected. Fixed avatar sizing, selected-tab readable tint, dark skeleton visibility, busy-button fill and compiled backdrop fallback ordering. Normal and reduced modes retain actual Glisse components.

Design audit: no source raw hex outside tokens.css; no app-owned raw radius/shadow/duration values. Shared palette/type/motion/z-index tokens intentionally include roles reserved for future screens; vendor geometry/internal physics remain third-party implementation. Inter is bundled locally; no external fonts or backend calls. Glisse springs were confirmed to snap when OS reduced motion is enabled. Unsupported/reduced-transparency forces solid material and explains why its switch is disabled. Real Telegram and mid-range Android measurements remain scheduled for Steps 2/4.

Delivery: Conventional Commit and tag step-01; push to origin/main. Remote revision/CI outcome is recorded in the task report. Stop here; Step 2 requires “davom et”.
