# Project working rules

Read AGENTS.md, DESIGN.md, PLANS.md, and SKILLS_STATUS.md before each step. Full brief: docs/MASTER_PROMPT.md. Implement only the requested step, update PLANS.md with scope, acceptance and risks, then stop for “davom et”.

- Existing cloud tasks are isolated: use this checkout; do not create worktrees unless requested.
- Static customer UI and typed mock data layer first; no backend calls until Step 4 explicit UI approval.
- Next.js App Router, strict TypeScript (no any), pnpm, Tailwind. Validate external APIs against docs/types before use.
- DESIGN.md and src/styles/tokens.css are styling authorities. No raw hex outside tokens. Tokenize spacing, radii, materials, type and motion. One iOS palette, light/dark parity, Uzbek Latin default, Russian secondary, English fallback.
- Glisse 0.5.0 must supply its available buttons, tab bars, segments, switches, sliders and menus. Document gaps; don't invent exports. Native behavior and haptics use a typed Telegram wrapper with version guards and dev-only mocks.
- Every interactive component needs keyboard focus, disabled/loading/error/empty states, 44px touch targets, AA contrast, safe areas, reduced-motion/transparency support.
- Never commit secrets or .env files; maintain .env.example. No client secrets or localStorage auth. Later server inputs require zod; initData validated server-side.
- Digital goods inside Telegram use Stars (XTR) only. Third-party payment adapters remain disabled; entitlement requires verified successful_payment, idempotency and audit. Verify current official rules at the payments step.
- Run pnpm lint && pnpm typecheck && pnpm test && pnpm build. UI steps also require Playwright, axe, and inspected screenshots at 390x844, 360x800, 430x932 in both themes under docs/screens/step-XX/.
- Conventional Commit, tag step-XX, push origin/main, report checks and limitations honestly. Never force-push. Never claim CI green without evidence.
- Report simple Uzbek: done, exact verification, risks, numbered manual actions, screenshots. Stop after the requested step.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
