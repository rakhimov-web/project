# Design status

Step 0 defines tooling only. The complete nine-section design system, Glisse gaps, haptics and motion map are scheduled for Step 1. src/styles/tokens.css currently contains only neutral scaffold tokens, not the approved customer design.

Reference packs cloned from https://github.com/Meliwat/awesome-ios-design-md into /tmp/ios-design-md: messaging/telegram, video/apple-tv, misc/duolingo, fitness/apple-fitness, finance/apple-wallet, productivity/things-3. Use framework-neutral DESIGN.md as structure and SwiftUI as behavior/token reference. Reference assets remain outside this repository; do not copy branding.

Use the iOS light/dark system palette, system font stack (self-host Inter fallback in Step 1), 4/8pt spacing, accessible targets, safe areas and reduced-motion/transparency fallbacks. No customer UI or Glisse controls implemented in Step 0.
