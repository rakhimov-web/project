# Step 2 — Telegram test guide

## Current evidence and limit

The shell is static. Browser tests simulate the Telegram protocol and separately run the actual development mock. They do not prove a Telegram iOS/Android client works. A real test-bot launch is pending: BOT_USERNAME and the HTTPS origin are placeholders, no bot binding/domain was supplied. Do not mark that gate passed until the checklist below is executed on a real client.

No bot token is needed in this frontend or in chat. Do not enter one into NEXT_PUBLIC variables. There is no auth/session, business API, database or payment operation in Step 2. initDataUnsafe is untrusted, display-only data; it is never sent, persisted as an auth credential or used to grant anything. A production browser outside Telegram gets no mock identity.

## Local developer/browser check

1. From /workspace/project, export the writable cloud cache paths documented in README.
2. Run pnpm dev. Open the application's root route in the browser.
3. A clearly visible “DEV · Namuna Telegram profili” label identifies the fake profile. Use the four bottom tabs and the course/lesson example routes. The mock is in-memory, not authentication.
4. Run pnpm build, then pnpm start to check the production behavior. Outside a Telegram launch the page says “Brauzer ko‘rinishi”; there is no fake user.
5. The production build scans server/static JavaScript for dev-mock/crash-probe markers and fails if either implementation leaks.

Unit tests cover version guards, lifecycle cleanup, gesture preference restoration, Back callbacks and haptic maps. Production Playwright injects a protocol simulator from tests/fixtures (not app code); the separate dev suite exercises the real dev-only branch and route error recovery. Offline UI applies after the app is loaded, not an offline-install/service-worker guarantee.

## Prepare an HTTPS test origin

If an existing HTTPS preview is available, use it. Otherwise, these manual account steps are required because no hosting account/domain is connected here:

1. Sign in at vercel.com. Click **Add New → Project**.
2. Import **rakhimov-web/project** from GitHub. Select **Next.js**, leave the root at the repository root and Node at **24.x**.
3. Keep the detected pnpm lockfile, set install to pnpm install --frozen-lockfile and build to pnpm build. Click **Deploy**.
4. Copy the generated HTTPS project URL. In **Settings → Deployment Protection**, ensure this test deployment can be loaded by the Telegram WebView (an account-login screen will block testing).
5. In **Settings → Environment Variables**, set NEXT_PUBLIC_PRODUCTION_DOMAIN to that HTTPS origin and NEXT_PUBLIC_BOT_USERNAME to the test bot's username without @. Branding values may remain placeholders during this test. Redeploy after changing NEXT_PUBLIC variables.
6. Keep all Mini App pages on this one origin; do not redirect course/lesson/checkout routes to another host.

This is a manual test deployment, not the Step 12 production launch. No claim is made that a deployment was created by this task.

## Configure the Telegram test bot

1. Open the verified **@BotFather** in Telegram.
2. Send /newbot (or select an existing dedicated test bot under /mybots). Follow the name and username prompts. Keep any token private; this step does not use it.
3. Send /mybots → select the test bot → **Bot Settings → Menu Button → Configure menu button**. Enter the HTTPS origin and a short button label, e.g. “Kurslar”. BotFather may present equivalent prompts rather than nested buttons.
4. For the main Mini App, use /mybots → bot → **Bot Settings → Configure Mini App** when offered, and set the same HTTPS URL. A menu-button Mini App launch is sufficient for this test.
5. Open the bot conversation, tap the menu/Mini App button. Use that launch instead of pasting the HTTPS URL into a normal browser.
6. Do not configure Stars, invoices, payments, webhook URLs or production support commands in Step 2.

## Real-client acceptance checklist (not yet executed)

Record device/OS, Telegram version, timestamp, HTTPS origin and pass/fail for each:

- iOS and Android: app opens, ready/expand finish, no stuck loading/error; dev label is absent.
- Telegram profile first/last name, username and premium flag are display-only. UI explicitly says the profile is not verified yet. No fake identity appears.
- Light/dark follows Telegram's theme even when the OS theme differs. Header/background/bottom bar match our palette.
- All four Glisse navigation links work. Open a course example; native Back and in-app Back return correctly. Directly open a nested route and verify its parent fallback.
- Open the lesson-list sheet from a course example. Native Back closes the sheet first. Swiping after close behaves as before; no global swipe suppression persists.
- On supported clients, system/content safe areas keep the toolbar and bottom tabs out of notches/native controls. Rotation/expansion updates viewport height; vertical scrolling remains inside the shell.
- Scroll a long screen: the large title gives way to the compact blurred toolbar. Keyboard focus remains visible.
- Tap controls: primary actions use light impact; tabs/selections use selection feedback. Disable Haptics under Profile → Sozlamalar and confirm feedback stops. Fullscreen must stay off.
- Older clients degrade gracefully: no unsupported method exceptions, navigation and browser Back continue working.
- Interrupt the connection after load: offline state appears; restore it and verify recovery.
- Failure to fetch the SDK shows “Qayta ulanish”, never a silent fake profile.

## API evidence and outbound access

Read @twa-dev/types 8.0.2 (third-party declarations, not an official SDK implementation) for exact method names/types and inspected the Next.js router/error/template docs shipped with the installed framework. The frontend loads the **official** https://telegram.org/js/telegram-web-app.js only for Telegram launch data or an already present host bridge.

Current cloud policy denied both https://core.telegram.org/bots/webapps and the official script URL. Environment settings need the additive domain entries core.telegram.org and telegram.org for developer-side documentation checks. The draft-read tool currently fails, so no replacement of an unknown allowlist was attempted. User-device runtime access is separate from this cloud egress policy.

Before calling the real-client gate passed, check the current official Web Apps docs/changelog, especially reported same-origin restrictions. This verification was blocked here, not silently assumed complete. Conservative guards used by this shell: Back/haptics/background at 6.1, custom header hex at 6.9 (older clients use bg_color), vertical swipe methods at 7.7, bottom bar at 7.10, safe/content insets/fullscreen-related events at 8.0. Methods are checked for existence and exceptions do not break the static UI.
