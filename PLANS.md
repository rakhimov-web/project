# Implementation plan

## Step 0 — Repository foundation (complete)

Goal: reproducible static-first Next.js development, validation, and first CI push.
Files: scaffold, config, rules, tests, tooling, CI, documentation.
Acceptance: lint, strict typecheck, nonzero unit suite, production build, browser smoke pass; commit/tag/push; GitHub CI verified if available.
Risks: owner values unknown; named skill sources may be inaccessible; GitHub API/CI access may differ from Git access.
Decisions: use existing rakhimov-web/project checkout/origin. Node 24 LTS, pnpm 11.25.0; pinned Next/React scaffold versions. No backend, payments, or customer screens before their scheduled steps. Placeholder page only. No external font fetch during build; Inter self-hosting belongs to Step 1. Glisse 0.5.0 peer dependencies confirmed >=18 for React and React DOM; installation/gallery belongs to Step 1.
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

## Step 2 — App shell and Telegram layer (code/browser verified; real-client gate pending)

Goal: persistent customer shell, typed Telegram bridge, dev-only mock, native theme/bars/insets/back/haptics and static route stubs.
Files: src/lib/telegram, shell components, (app) route group/stubs, error/offline/loading surfaces, motion tokens adapter, tests, screenshots and Telegram setup guide.
Acceptance: real SDK loading boundary with retry/fallback; capability/version guards; events cleaned up; real Glisse navigation with browser and host Back; safe-area and stable viewport handling; no mock in production; light/dark mobile screenshots; lint/typecheck/unit/build/browser checks, commit/tag/push.
Constraints: no business backend calls or authentication claims. initDataUnsafe is display-only and untrusted. Fullscreen stays off. Existing owner placeholders remain. Real Telegram testing requires a configured HTTPS origin and bot; record this manual gate honestly.
Network evidence: core.telegram.org and telegram.org requests denied by current egress policy. Draft read still INVALID_ARGUMENT, so do not replace an unknown draft allowlist. Required development-doc domains: core.telegram.org, telegram.org. Read actual @twa-dev/types declarations instead of guessing API signatures; official current changelog/origin restriction verification remains blocked. Official SDK will be loaded from telegram.org at runtime only for a launch context, not replaced with an unofficial SDK package.

Validation: lint/design audit, strict typecheck, 13 unit tests, production build and production-only marker scan passed. 24 production Chromium tests passed (gallery regression plus shell) and 2 separate dev tests passed (actual dev mock and actual route error-boundary recovery). Six mobile light/dark shell screenshots and the offline sample were saved under docs/screens/step-02 and visually inspected. SDK failure/retry, no production fake identity, native theme/bars, stable viewport and both inset families, Back fallback, sheet-first Back, swipe preference restoration, haptic suppression and listener counts are covered. No backend/auth/payment capability was introduced.

Implementation decisions: use a Suspense shell boundary for this Next version's dynamic usePathname requirement. Keep route children rendered but hidden/inert while loading/offline/error, so instant-navigation validation can visit server segments; dev validation now runs without dropped-segment warnings. Use one Motion entry pane per route rather than retaining mutable Next route slots for exit animation, which caused duplicate current-page content. Motion spring/travel still come from tokens and push/pop direction is preserved. Optimized three-digit CSS hex is normalized before native color calls. Avatar/button names share initials generation and put visible initials outside parentheses for voice-control matching. ActionButton now preserves Glisse's actual icon-only variant. The dev QA route renders not-found/noindex in production; under streaming this Next version can return HTTP 200 for not-found, so tests validate its documented semantic outcome plus the absence of dev code, not an assumed status alone.

Toolchain decision: retain the tested Node 24 LTS/pnpm 11 foundation for reproducible step snapshots. No runtime upgrade is part of this shell change.
Delivery: Conventional Commit and step-02 tag, push origin/main; remote revision/CI evidence goes in the task report. Real-client acceptance remains NOT RUN, requiring the HTTPS origin and BotFather setup in docs/TELEGRAM_TESTING.md. Official Telegram docs/changelog verification is blocked by cloud egress policy; add core.telegram.org and telegram.org through environment settings. No token values are required in chat. Stop after reporting Step 2.

## Step 3a — Static Home (implementation/browser verified)

Goal: customer Home with an original course billboard, demo continue-learning rail, Glisse category filter, course rails, one benefits bento and a controllable tool marquee.
Files: typed domain-aligned fixtures/data-access contract, Home components/styles, semantic cover/motion tokens, browser/unit checks and six inspected mobile screenshots.
Acceptance: no business API calls; UI consumes a swappable data-access layer; functional filter/bookmark/navigation; demo progress explicitly labelled and never treated as real entitlement; loading/empty/error examples; light/dark, focus/targets/contrast/overflow, reduced motion/transparency; lint/typecheck/unit/build/browser/dev suites; commit/tag/push and CI.
Scope: Home only. Catalog/course/player remain Step 2 stubs until 3b/3c/3d. No backend/auth/payment work. Real Telegram gate from Step 2 remains unrun. Signature motion is the user-pausable marquee; course art is static and the one-time rail entrance is a small shared-token transition. No fake testimonials, reviews, earnings or enrollment claims. All cover art is original CSS/SVG, without external media.

Validation: lint/design guard, strict typecheck, 17 unit tests and production build/production-only exclusion guard passed. The full 34-test production browser suite and both dev tests passed; after final copy polish the 10 Home tests were rerun and passed, including solid-material axe validation. Six mobile/theme screenshots plus 390px course/benefit views were saved under docs/screens/step-03a and visually inspected. Checked no business API calls, minimum targets, page/scroll-pane overflow, keyboard category selection/haptics, saved-state continuity across routes, course/lesson destinations, loading/empty/error/retry and marquee pause/OS preferences.

Corrections from validation: configured Vitest's existing @ path alias so data modules can be tested; changed rail containers/items to native ul/li; prevented icon-only flex controls shrinking below 44px; anchored screen-reader price/skeleton text to its own containing block so reduced-motion mode cannot escape a horizontal rail and enlarge the shell scroll area. Artwork colors/radii/spacing/motion remain tokenized. Brand/instructor display fallbacks are centralized in brand.ts. Historical Step 1/2 screenshots remain unchanged.

Delivery: Conventional Commit and tag step-03a, pushed to origin/main; remote SHA/CI are reported in the task result. Next requested sub-step is 3b Catalog. No backend work or UI-freeze approval is implied. Step 2 real Telegram/bot/domain/current-doc verification remains pending in docs/TELEGRAM_TESTING.md; no new manual prerequisite was introduced by Home.
