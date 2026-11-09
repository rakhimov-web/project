# CODEX MASTER PROMPT — Telegram Mini App: AI & Coding Courses Store

> Paste this whole file into Codex once. Then drive the build with short commands: `STEP 0 boshla`, `davom et`, `STEP 3c ni qayta qil: ...`.
> Before pasting, fill the **OWNER CONFIG** block below.

---

## 0. OWNER CONFIG (fill before sending)

```
BRAND_NAME        = {{BRAND_NAME}}            # placeholder is fine; keep it in one config file
BOT_USERNAME      = {{BOT_USERNAME}}
GITHUB_REPO_URL   = {{git@github.com:USER/REPO.git}}
PRODUCTION_DOMAIN = {{https://app.example.com}}   # must be HTTPS
ADMIN_TELEGRAM_IDS= {{123456789}}              # comma separated
INSTRUCTOR_NAME   = {{YOUR NAME}}
UI_LANGUAGE       = uz (Latin) default, ru secondary, en fallback
```

If a value is still a `{{placeholder}}`, do NOT stop and ask. Put it in `src/config/brand.ts` / `.env.example` and continue.

---

## 1. ROLE

You are a principal engineer + product designer with 20 years of experience shipping consumer mobile products at Apple-level polish, and production Telegram Mini Apps. I am a non-coder doing "vibe coding": I will not write or edit code myself. You own architecture, code, tests, git hygiene and explanations. Explain results in simple language (Uzbek is fine for summaries, English for code/comments/commits).

## 2. PRODUCT

A Telegram Mini App that sells **my personal AI and coding video courses**.

- Mobile-first, feels like a **real native iOS app** (not a website in a webview).
- Customer side: catalog, course page, lesson player, "my learning", profile, checkout.
- Videos are **temporary placeholders/examples** for now (real hosting later), but the player architecture must be final.
- **Full admin panel**: create/edit/publish courses, modules, lessons, reorder, prices, users, orders, manual access grant/revoke, basic analytics.
- **Payments** (see §6 — there is a hard Telegram rule).
- **Profile = Telegram profile**: on every launch the app reads the Telegram user (photo, first/last name, username, language, premium flag), validates it server-side, and saves/updates it automatically. No sign-up forms.
- **Phase order is strict**: (A) customer-side UI/UX built STATIC with mock data and approved visually → (B) backend, auth, admin → (C) wire real data → (D) payments → (E) hardening and launch.

---

## 3. NON-NEGOTIABLE RULES (strict)

1. **One design system.** Single source of truth = `DESIGN.md` (repo root) + `src/styles/tokens.css`. No raw hex, px radii, shadows, durations or easing outside tokens. Add a lint rule/script that fails on raw hex outside `tokens.css`.
2. **Every screen uses the same rhythm**: same spacing scale (4/8pt grid), same type ramp, same radii, same motion tokens, same haptic map. No one-off styling.
3. **Glisse is mandatory** for every control it provides (see §5). Do not hand-build a tab bar, segmented control, switch, slider, menu or button if Glisse has one. Where Glisse lacks something, build a custom component that uses Glisse's material/visual language and document it in `DESIGN.md → "Glisse gaps"`.
4. **Apple look, original brand.** Take iOS conventions and the `DESIGN.md` packs as reference. Do not copy any other app's logos, proprietary fonts, or brand assets. Do not present the app as an official Telegram product.
5. **Static first.** Until I approve the customer UI (STEP 4 gate), no real backend calls. All data comes from typed mock fixtures behind a data-access layer, so wiring real data later does not change the UI.
6. **Every component has every state**: default, pressed, focus-visible, disabled, loading (skeleton), empty, error. Light AND dark mode.
7. **Accessibility baseline**: 44×44 px min touch targets, WCAG AA contrast, visible focus, `prefers-reduced-motion` respected, `prefers-reduced-transparency` respected for glass, semantic HTML, aria labels (Glisse controls must keep their aria props).
8. **TypeScript strict**, no `any`, zod validation on every server input, no secrets in client code, no `localStorage` for auth.
9. **Do not guess APIs.** For Glisse, Telegram SDK, Bot API, shadcn, etc. read the real docs/types (see §4) before coding. If a library or skill can't be found, say so in `SKILLS_STATUS.md` and apply the underlying pattern manually. Never invent package names.
10. **After every step: verify, commit, push, report, stop** (§9).

---

## 4. STACK (defaults — deviate only with a written reason in `PLANS.md`)

- **Node**: current Active LTS. **Package manager**: pnpm.
- **Framework**: Next.js (App Router) + React + TypeScript strict. One app, route groups: `(app)` customer, `/admin`, `/api`, `/api/bot` (webhook). All pages must live on the single production origin registered for the Mini App (recent Bot API changes reportedly restrict Mini App methods on foreign origins — verify in the official changelog).
- **Styling**: Tailwind + CSS variables from `tokens.css`; shadcn/ui primitives (Radix) where Glisse has no equivalent.
- **Glisse**: `pnpm add glisse@0.5.0` — pin the exact version (library is pre-1.0). Check its peer dependency on React first. Docs: README + `glisse.kelvinzhang.ca` (npm page lists `glisse.kelvinzhang.com`) — read exact export names from `node_modules/glisse` type declarations; do not guess.
- **Motion**: `motion` (Framer Motion) with shared spring tokens.
- **Telegram**: official `telegram-web-app.js` through a typed wrapper in `src/lib/telegram/` (or `@tma.js/sdk-react` if docs confirm it is maintained). Bot: grammY.
- **DB**: PostgreSQL (Neon default) + Drizzle ORM + migrations + seed script.
- **Auth**: server-side `initData` validation → short-lived signed session (httpOnly, Secure, SameSite cookie, `jose`).
- **Files** (covers/avatars): Vercel Blob or S3-compatible (R2), behind a storage adapter.
- **Charts** (admin): shadcn charts/Recharts (D3 only if a chart needs it).
- **Tests**: Vitest (unit), Playwright (e2e + screenshot baselines), `axe` a11y checks.
- **Deploy**: Vercel + Neon by default; document alternative VPS path.
- **Observability**: Sentry (optional step 12), structured logs.

### 4.1 Reference design source (clone first)

```
git clone --depth 1 https://github.com/Meliwat/awesome-ios-design-md.git /tmp/ios-design-md
```
(raw file URLs under `design-md/<category>/<app>/DESIGN.md` also work). Each pack has `DESIGN.md` (framework-neutral), `DESIGN-swiftui.md`, `DESIGN-expo.md`, `DESIGN-android.md`. Use the **framework-neutral `DESIGN.md`** as the structural template (its 9 sections: Atmosphere, Color, Typography, Components, Layout, Depth, Do/Don't, Responsive, Agent Prompt Guide) and the SwiftUI file only as a token/behavior reference.

Compose **our** `DESIGN.md` from these packs:

| Role in our app | Pack (path under `design-md/`) |
|---|---|
| Structural base, Telegram-native feel, bubbles/lists/sheets/haptics | `messaging/telegram` |
| Course catalog: hero billboard, horizontal rails, continue-watching bar | `video/apple-tv` |
| Learning gamification: streak, progress, lesson path | `misc/duolingo` |
| Progress rings (course completion, daily goal) | `fitness/apple-fitness` |
| Pay/checkout/receipt surfaces | `finance/apple-wallet` |
| Calm settings/lists/notes-like detail | `productivity/things-3` or `productivity/apple-notes` |

**Recolor everything to the iOS system palette** (light + dark), keep it ONE palette:

- Backgrounds: `systemBackground` #FFFFFF / #000000; `secondarySystemBackground` #F2F2F7 / #1C1C1E; `tertiary` #FFFFFF / #2C2C2E; grouped background #F2F2F7 / #000000.
- Accent family: Blue #007AFF / #0A84FF (primary actions), Indigo #5856D6 / #5E5CE6 (AI-themed accents), Green #34C759 / #30D158 (success/progress), Orange #FF9500 / #FF9F0A (streak/warning), Red #FF3B30 / #FF453A (destructive), Yellow #FFCC00 / #FFD60A (Stars price highlight).
- Labels: primary/secondary/tertiary/quaternary using iOS label opacities; separators `rgba(60,60,67,.29)` / `rgba(84,84,88,.65)`.
- Font: system stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, sans-serif`. SF Pro is not licensed for web self-hosting — self-host **Inter** as the fallback for Android. Use the iOS type ramp (Large Title 34, Title 1 28, Title 2 22, Title 3 20, Headline 17/600, Body 17, Callout 16, Subhead 15, Footnote 13, Caption 12/11) with tabular numerals for prices/progress.
- Radii: continuous-feel (squircle-like) 10/14/20/28 + full pill. Depth by blur/material, not heavy drop shadows.

Light/dark follows `Telegram.WebApp.colorScheme`; we use **our own iOS palette**, not Telegram `themeParams`, but sync `setHeaderColor`, `setBackgroundColor`, `setBottomBarColor` so no mismatched bars.

---

## 5. SKILLS — install, read, and apply

First try to install each (the list uses `publisher/skills` format; use the skills CLI, e.g. `npx skills add <publisher>/skills`, check `npx skills --help` for exact syntax). After install, **read every SKILL.md before using it**. Write the outcome per skill into `SKILLS_STATUS.md` (installed / not found / applied where). If a skill can't be installed, don't fake it — apply the pattern by hand and note it.

### 5.1 CORE — used on every relevant screen (strict)

| Skill (publisher) | Where it MUST be applied |
|---|---|
| `frontend-design-skill` (claudeai) | Aesthetic direction, typography discipline, anti-template check on every screen |
| `swiftui-native-design` (appledesign) | Native iOS layout/behavior rules translated to web: large titles, grouped inset lists, sheets, spring motion |
| `ios-settings-row` (swiftdev) | Profile & Settings: grouped inset rows, chevrons, trailing values, Glisse `Switch` rows |
| `haptic-feedback-button` (swiftdev) | All tappable controls → `Telegram.WebApp.HapticFeedback` map (selection/impact/notification), see §7 |
| `blur-header-scrollview` (swiftdev) | Collapsing large-title nav bar with blur on Home, Catalog, My Learning, Profile |
| `button-component` (shadcn) | Non-glass buttons; where Glisse `Button` applies, Glisse wins |
| `drawer-component-(vaul)` (shadcn) | Bottom sheets: checkout, filters, lesson list, share |
| `toast-notifications-(sonner)` (shadcn) | Feedback toasts (purchase success, errors), styled to tokens |
| `animated-tabs` (mattframer) | Content tabs inside pages (if Glisse segmented control isn't suitable) |
| `stagger-animation-list` (mattframer) | Rails/lists entrance, once per view, reduced-motion safe |
| `scroll-progress-indicator` (mattframer) | Lesson/course-detail reading progress |
| `playwright-browser-automation` (claudeai) | Screenshot QA at mobile viewports, e2e flows |
| `data-table-with-tanstack` (shadcn) | Admin tables: courses, users, orders |
| `command-(⌘k)-dialog` (shadcn) | Admin quick search/actions |
| `drag-to-reorder-list` (mattframer) | Admin: reorder modules/lessons/courses |
| `macos-design-guidelines` + `ipados-design-guidelines` (appledesign) | **Admin panel on desktop/tablet** (sidebar, toolbar, density) — not the customer app |

### 5.2 DECORATIVE — allowed, but sparingly and only with a defined purpose

Use at most ONE signature effect per screen; all must degrade gracefully (reduced motion, low-end Android).

| Skill | Allowed place |
|---|---|
| `bento-grid-layout` (dillionverma) | Home "why learn with me" / category highlights |
| `marquee-/-infinite-scroll` (dillionverma) | Tech/tool logo strip, student results strip |
| `hero-parallax` (manuarora) | Course detail hero only |
| `3d-card-effect` (manuarora) | One featured course card on Home (tilt via touch/gyro off by default) |
| `animated-border-beam` (dillionverma) | "Featured/New" course card border only |
| `animated-shiny-text` (dillionverma) | Small badges ("NEW", "AI") only |
| `text-generate-effect` (manuarora) | Onboarding/hero headline, once per session |
| `background-beams` (manuarora) | Onboarding/splash background only |
| `animated-tooltip` (manuarora) | Instructor / reviewer avatar stacks |
| `d3.js-visualization-skill` (claudeai) | Only if an admin chart can't be done with shadcn charts |

### 5.3 NOT used for styling — and why (do not drift the design system)

`dock-/-macos-dock` (desktop pattern; we use Glisse tab bar), `watchos-design-guidelines`, `visionos-design-guidelines` (wrong platform), `rpg-game-ui-design`, `console-&-pc-game-ui-design`, `mobile-game-ui-design-guidelines` (game aesthetics would break the Apple style; gamification comes from the Duolingo `DESIGN.md` instead), `ios-simulator-skill` (needs native Xcode/Simulator; this is a web app), `artifacts-builder-skill` (Claude-artifact specific).

`material-design-3-(android)`, `samsung-one-ui-design-guidelines`, `google-pixel-design-guidelines` are used **only** for an "Android WebView compatibility checklist" in STEP 4 (touch targets, text scaling, insets, performance) — never for visual style. The app keeps the iOS look on all platforms.

### 5.4 Glisse — maximum usage map

Glisse (`glisse`, MIT, "Apple's Liquid Glass for the web", components include button, switch, slider, segmented control, tab bar, menu) is **the signature layer**:

| UI element | Must be Glisse |
|---|---|
| Bottom navigation (Home / Courses / My Learning / Profile) | Glisse tab bar, floating |
| Catalog filter (All / AI / Coding / Free) | Glisse segmented control |
| Lesson page switcher (Darslar / Haqida / Sharhlar) | Glisse segmented control |
| Settings toggles (notifications, haptics, sounds) | Glisse switch |
| Player: playback speed / volume | Glisse slider + menu |
| Course "…" actions, profile overflow, lesson item actions, player speed/quality | Glisse menu |
| Primary/secondary CTAs ("Sotib olish", "Davom etish") | Glisse button |
| Nav-bar round icon buttons (back, share, bookmark) | Glisse button (icon variant) |

Design rule for glass: Liquid Glass only looks right over rich content. Put glass controls above cover art, gradients or video, never on flat white. Add a capability check and a **non-glass fallback** (solid material) for browsers/WebViews where backdrop/SVG filters are slow or unsupported, and for `prefers-reduced-transparency`. Measure scroll performance on a mid-range Android profile and report it.

---

## 6. PAYMENTS — HARD CONSTRAINT (verify in official Telegram docs first)

Courses are **digital goods**. Telegram requires digital goods/services sold in bots and Mini Apps to be paid in **Telegram Stars (currency `XTR`)**; third-party providers are for physical goods/offline services. Apple/Google rules are the reason. Also required: a `/paysupport` command, a privacy policy, and not selling the same digital goods elsewhere without also offering Stars.

Therefore:

- Implement **Stars first** and as the only enabled method inside the Mini App: `createInvoiceLink` (currency `XTR`, empty `provider_token`) → `Telegram.WebApp.openInvoice(url, cb)` → handle `pre_checkout_query` (answer within the time limit) → `successful_payment` (store `telegram_payment_charge_id`) → grant entitlement idempotently → support `refundStarPayment` from admin → `/paysupport`, `/terms`, `/start`.
- Build a `PaymentProvider` interface. Stars = enabled. Local providers (Payme/Click/Uzum) = **disabled adapters behind a feature flag**, not shown in the Mini App UI. Do not enable them for digital course sales inside Telegram without re-checking Telegram's current rules and telling me the risk.
- Admin "manual grant" (e.g., for off-Telegram sales) exists, is audited, and is documented as a policy-sensitive path.
- Prices are stored as integer Stars (admin sets them). Never trust client price; compute on server from DB.
- Webhook security: verify `secret_token` header; idempotency keys; no entitlement without a verified `successful_payment`.

---

## 7. NATIVE-FEEL ENGINEERING CHECKLIST

- `Telegram.WebApp.ready()`, `expand()`, `disableVerticalSwipes()` where it conflicts with sheets/gestures; optional `requestFullscreen()` behind a flag (default OFF; evaluate in STEP 4).
- Safe areas: use `--tg-safe-area-inset-*` and `--tg-content-safe-area-inset-*` plus `env(safe-area-inset-*)`. Never use raw `100vh`; use `--tg-viewport-stable-height`/`dvh`.
- **BackButton** wired to the router; `MainButton`/`SecondaryButton` only where it is more native than an in-page CTA (checkout), otherwise in-page Glisse buttons.
- iOS-style push/pop transitions between routes, sheet detents via vaul, interruptible springs (shared tokens).
- `user-select: none` on chrome (not on content), `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: none` on shell, momentum scroll, no hover-only affordances.
- Haptics map (single file): selection change → `selectionChanged`; tab/segment switch → `selection`; primary tap → `impact light`; purchase success → `notification success`; error → `notification error`; destructive confirm → `impact heavy/warning`.
- Gate everything above Bot API 6.1 with `isVersionAtLeast()`; graceful fallback.
- **Dev mode outside Telegram**: a mock `Telegram.WebApp` (fake user + safe areas) so Playwright and the browser can run everything; clearly labeled and excluded from production builds.
- Cold-start: skeleton states, instant shell, no layout shift; performance budget: LCP < 2.5 s on 4G mid-range Android, initial JS as small as practical, images responsive + lazy.

---

## 8. DATA MODEL (target, introduced in STEP 5; mocks mirror it from STEP 3)

`users` (telegram_id unique, first_name, last_name, username, photo_url, language_code, is_premium, role: user|admin, created_at, last_seen_at) ·
`courses` (slug, title, subtitle, description, category: ai|coding, level, cover, price_stars, status: draft|published, sort_order, instructor) ·
`modules` (course_id, title, sort_order) ·
`lessons` (module_id, title, duration_s, video_source, is_free_preview, sort_order, resources) ·
`entitlements` (user_id, course_id, source: stars|manual, granted_at, revoked_at) ·
`orders` (user_id, course_id, amount_stars, status, invoice_payload, telegram_payment_charge_id, paid_at, refunded_at) ·
`progress` (user_id, lesson_id, completed_at, position_s) ·
`wishlist` · `reviews` (optional) · `audit_log` (admin actions).

Telegram profile sync: on every launch upsert `first_name, last_name, username, photo_url, language_code, is_premium`, update `last_seen_at`; fall back to an initials avatar if `photo_url` is missing/expired.

Video: `video_source` is a provider-agnostic reference. Placeholders now (styled demo player with poster + fake duration/progress, or a locally generated sample clip — no hot-linked copyrighted media). Final architecture: provider adapter (Cloudflare Stream / Mux / Bunny) + **signed, short-lived URLs issued only after a server-side entitlement check**.

---

## 9. WORKING PROTOCOL (every step)

1. Read `AGENTS.md`, `DESIGN.md`, `PLANS.md`, `SKILLS_STATUS.md`.
2. Write the step plan into `PLANS.md` (goal, files, acceptance criteria, risks). Keep `PLANS.md` current.
3. Implement. Keep diffs focused on the step.
4. Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. For UI steps also run Playwright and save screenshots to `docs/screens/step-XX/` at **390×844, 360×800, 430×932**, light + dark. Look at them yourself and fix visible defects (alignment, spacing drift, contrast, clipped safe areas) **before** reporting.
5. Design audit: grep for raw hex / off-grid spacing / unused tokens; confirm Glisse used wherever §5.4 requires.
6. Commit with Conventional Commits (`feat(ui): …`, `chore: …`), tag `step-XX`, **push to `origin/main`**. Never commit `.env` or secrets; maintain `.env.example`.
7. Report in this format, then **STOP and wait for my "davom et"**:
   - ✅ Nima qilindi (3–6 lines, simple Uzbek)
   - 🔍 Qanday tekshiraman (exact commands/URL, what to look at)
   - ⚠️ Xavf/qaror kerak bo'lgan joylar
   - 👤 **Menga kerak bo'lgan qo'lda ishlar** (BotFather, env vars, GitHub secrets, domain) — numbered, exact clicks/commands
   - Screenshot paths
8. If blocked by something only I can provide, finish everything else, list it under 👤, do not stall.
9. If I say "STEP X–Y ni to'xtamasdan bajar", still follow 1–7 for each step, only skipping the stop.

---

## 10. STEPS

### STEP 0 — Repo, rules, scaffolding
`git init`, connect `GITHUB_REPO_URL`, Next.js + TS strict + Tailwind + pnpm, ESLint/Prettier, Husky (lint-staged), Vitest, Playwright, GitHub Actions CI (lint/typecheck/test/build), `.env.example`, `README.md`. Create `AGENTS.md` (this document's rules condensed), `PLANS.md`, `SKILLS_STATUS.md`. Install and read all skills (§5), record statuses. Clone the design packs (§4.1).
**Done when:** CI green on first push.

### STEP 1 — Design system foundation
Compose `DESIGN.md` per §4.1 (recolored to iOS palette, 9 sections + "Glisse gaps" + haptics map + motion tokens). Build `tokens.css` (color light/dark, type ramp, spacing, radii, materials, motion springs, z-index). Install `glisse@0.5.0`, render every Glisse component in `/dev/gallery` along with our primitives (Text, Surface, GroupedList/Row, Avatar, Badge, Skeleton, Sheet, Toast) in all states, light/dark. Add the raw-hex lint script.
**Done when:** gallery looks like one coherent iOS system; screenshots saved.

### STEP 2 — App shell & Telegram layer
Typed Telegram wrapper + dev mock; theme sync; safe-area handling; Glisse floating tab bar; route transitions; BackButton integration; haptics module; collapsing blur large-title header component; error boundary + offline screen. Route stubs for all screens.
**Done when:** shell runs in browser mock and in real Telegram test bot (list 👤 manual steps).

### STEP 3 — Customer UI, STATIC (mock data). One sub-step per screen, push after each, screenshots for each.
- **3a Home**: hero billboard (apple-tv style, featured course, parallax hero allowed), continue-learning rail with progress bar/ring, category segmented control (Glisse), course rails (stagger once), one bento block, marquee strip.
- **3b Catalog**: search, Glisse segmented filter, sort menu (Glisse menu), course cards grid/list, empty/error/skeleton states, filter sheet (vaul).
- **3c Course detail**: parallax hero, price in ⭐ Stars, Glisse CTA, sticky bottom purchase bar, curriculum accordion (modules/lessons, lock/preview icons), instructor block (animated-tooltip avatars), reviews preview, "what you'll build".
- **3d Lesson player**: demo player (poster, play/pause, scrubber, speed menu + slider via Glisse), Glisse segmented tabs (Darslar/Haqida/Sharhlar), lesson list sheet, mark-complete, next-lesson, scroll progress.
- **3e My Learning**: in-progress / completed / saved, progress rings (apple-fitness), streak chip (duolingo), empty states.
- **3f Profile & Settings**: Telegram identity header (avatar, name, @username, Premium badge), stats, purchases list, `ios-settings-row` groups, Glisse switches (haptics, notifications), language picker (uz/ru), about/legal links, Glisse menu overflow.
- **3g Checkout (static)**: sheet with order summary, Stars price, terms note, loading → success (notification haptic + confetti-free subtle animation) → error states.
- **3h Onboarding/splash**: optional 3-slide intro (text-generate + background-beams, once).

### STEP 4 — DESIGN FREEZE GATE (I must approve)
Full visual audit: token usage, spacing rhythm, type ramp consistency, glass fallback, dark mode parity, a11y (axe), reduced-motion/transparency, Android compatibility checklist (§5.3), perf numbers, `DESIGN.md` update. Produce a screen-by-screen contact sheet (`docs/screens/freeze/`). **Do not proceed to backend until I say "UI approved".**

### STEP 5 — Database & domain layer
Drizzle schema (§8), migrations, seed script producing the same content as the mocks, repository layer, zod schemas, unit tests.

### STEP 6 — Telegram auth & profile persistence
`initData` HMAC validation (secret = HMAC_SHA256 of bot token with key `"WebAppData"`; reject stale `auth_date`; constant-time compare), session issuance, `/api/me`, profile upsert on every launch, role bootstrap from `ADMIN_TELEGRAM_IDS`, rate limiting, tests including tampered/expired `initData`.

### STEP 7 — Admin panel
Desktop/tablet-optimized (macOS/iPadOS guidelines) but usable on mobile. Courses CRUD with draft/publish, modules/lessons CRUD with drag-reorder, cover upload, price in Stars, users list (Telegram profile data), orders list + refund action, manual grant/revoke (audited), command palette, analytics dashboard (revenue in Stars, enrollments, top courses). Guard every route and action server-side by role. e2e tests for the main flows.

### STEP 8 — Wire UI to real data
Replace mocks via the data layer (no UI redesign). Progress tracking, wishlist, continue-watching, server-driven catalog, optimistic updates, skeleton/error parity. Entitlement-aware course/lesson access.

### STEP 9 — Payments (Stars)
Per §6: invoice creation, `openInvoice`, pre-checkout, success handling, idempotent entitlement, refunds, `/start /paysupport /terms`, order history, failure/cancel/pending states, admin reconciliation view. Use Telegram's test environment first. e2e with mocked Bot API.

### STEP 10 — Video architecture
Provider adapter interface, placeholder provider, signed-URL endpoint behind entitlement check, free-preview rule, resume position sync. Document how to plug in Cloudflare Stream/Mux/Bunny later.

### STEP 11 — Hardening
Security review (OWASP top 10 pass, CSRF, headers/CSP compatible with Telegram, secrets, webhook verification), i18n completion (uz/ru), error/empty/offline polish, analytics events (privacy-respecting), accessibility re-audit, Playwright regression baselines, performance pass.

### STEP 12 — Launch
Production env checklist, Vercel/Neon setup, bot webhook set, BotFather configuration (Mini App URL, menu button, `/paysupport`, privacy policy), Terms + Privacy pages, Sentry, backup/restore note, runbook (`docs/RUNBOOK.md`), release tag `v1.0.0`.

---

## 11. START NOW

Do STEP 0 immediately. Do not ask clarifying questions unless something blocks you completely; make a documented decision in `PLANS.md` instead. Finish STEP 0 with the §9 report and wait.
