# Step 3a Home visual evidence

Six initial viewport screenshots use 390×844, 360×800 and 430×932 in light and dark mode. The shell scrolls internally, so additional 390px screenshots show the course shelves and benefits section. Images use a browser-injected Telegram protocol simulator and reduced motion for repeatable captures; they are not real-client screenshots.

Run from the repository root after pnpm build:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium CAPTURE_HOME=1 pnpm exec playwright test tests/e2e/home.spec.ts
```

The main fixture catalog and labelled learning progress are sample content. No purchase, real entitlement or authenticated learning history is demonstrated. The production/dev mock exclusion guard remains part of pnpm build.
