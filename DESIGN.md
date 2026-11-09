# AI & Coding — Design system

Status: Step 1 foundation. This system governs the later customer UI; it is not the Step 4 visual approval. The interactive specimen is /dev/gallery. CSS values live in src/styles/tokens.css; component styles consume semantic tokens.

## 1. Atmosphere

Calm, precise, encouraging. Learning content carries the expression; chrome stays quiet. Large titles, grouped inset lists, restrained separators, and sheets follow familiar iOS behavior on every platform. One signature effect per screen at most. The gallery uses one original indigo-to-blue material study, with no copied brand assets.

Reference: Meliwat/awesome-ios-design-md, commit 5d3aeca239caef3ea4080034eb22ab87cc77fa24. Framework-neutral packs read for structure: messaging/telegram (list/sheet rhythm), video/apple-tv (content-first hero/rails), misc/duolingo (clear progress), fitness/apple-fitness (rings), finance/apple-wallet (transaction hierarchy), productivity/things-3 (quiet typography). SwiftUI Telegram reference supplies behavior inspiration only. Recolor every borrowed structural idea to our iOS palette. Never imply official Apple/Telegram affiliation.

## 2. Color

Use semantic variables rather than raw values. System backgrounds: white/black; secondary/grouped: iOS grouped gray in light, black canvas and elevated charcoal in dark; tertiary surfaces distinguish nesting. Primary ink is black/white. Secondary readable ink is deliberately stronger than iOS translucent labels on varied backgrounds.

Six accent families: system blue (actions), indigo (AI), green (progress), orange (streak/warning), red (destructive), yellow (Stars). Exact iOS light/dark values are centralized in tokens.css. Translucent secondary/tertiary/quaternary label tokens are available for decorative hierarchy; tertiary/quaternary must never carry required text.

Accessibility adaptations: action-fill is a deeper blue derivative in light mode so normal-size white button text meets AA; dark action-fill uses dark ink. Accent-text, success-text, danger-text and warning-text are readable derivatives for text. Do not put normal white text on unmodified system blue/green/yellow. Destructive meaning also uses icon/text, never color alone.

Light/dark defaults to OS in this gallery; the theme button is an ephemeral demonstration override. Step 2 will connect Telegram colorScheme, header/background/bottom-bar colors without adopting themeParams as our palette.

## 3. Typography

System-first stack: -apple-system, BlinkMacSystemFont, SF Pro Text, SF Pro Display, locally bundled Inter Variable, Inter, system-ui, sans-serif. SF fonts are used only when supplied by the OS, never distributed. Inter is installed through @fontsource-variable/inter and served locally; builds do not contact a font CDN.

Ramp in CSS pixels at the default root size: Large Title 34/700, Title 1 28/700, Title 2 22/700, Title 3 20, Headline 17/600, Body 17/400, Callout 16, Subhead 15, Footnote 13, Caption 12, Caption 2 11. Use rem so text scaling remains available. Body line-height 1.5, title 1.12; title tracking is mildly tight. Use tabular numerals for price/progress. Text accepts semantic heading tags; one h1 per screen, ordered section headings. Uzbek Latin is default; allow wrapping and longer Russian labels.

## 4. Components

- Text, Surface, Badge, Avatar, GroupedList/Row, Skeleton, ProgressRing are reusable primitives. Avatar currently supplies initials; real Telegram photos and expired-image fallback arrive in Step 2/3f. Rows are structural, not fake clickable divs: compose a real link/button when navigation is added.
- Glisse is pinned to 0.5.0. Its installed README, index.d.ts and implementation were inspected. Actual exports: Button, Glass, Input, Menu, SearchField, SegmentedControl, Slider, Switch, TabBar. All nine appear in the gallery. No guessed APIs.
- ActionButton is a thin Glisse Button wrapper with busy/disabled behavior. Icon buttons have a name. Controls keep their native props, roles and library keyboard handlers.
- SegmentedControl uses radiogroup/radio semantics, with arrow/Home/End selection. TabBar uses tablist in the interactive specimen, with a named tabpanel; later route navigation will use href/link support.
- Switch uses role=switch and aria-checked. Slider keeps its native range input. Every control target is at least 44px; switches retain Glisse track geometry inside the larger target.
- Input and SearchField are also Glisse. Labels are explicit; errors use aria-invalid and aria-describedby. Search clear stays a native named button.
- Sheet uses Vaul/Radix Dialog semantics, title/description, focus trapping, Escape dismissal and return focus. Close is a Glisse icon Button. Portal content carries the selected theme.
- Toast uses Sonner live announcements and tokenized surfaces. Success/error triggers are Glisse. Toaster is local to the provider.

State contract: default, hover where supported, pressed, focus-visible, disabled and busy for actions; on/off for switches; selected/unselected for segments/tabs; editable/empty/invalid/disabled for inputs; min/max/value/disabled for slider; open/closed/disabled-item for menu/sheet. Collection primitives compose skeleton, empty and recoverable error surfaces (gallery section 05). Static Text/Badge/Avatar do not pretend to have loading or pressed semantics; use Skeleton at their content boundary. The disabled group demonstrates native fieldset behavior for Glisse controls lacking a disabled root prop.

## 5. Layout

4/8pt scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. 20px mobile gallery gutter, 32px larger-screen gutter; content centered at 768px maximum. Text is readable without horizontal scrolling at 360px. Lists have 64px baseline rows and expand for text. Controls are at least 44px tall, fields 48px. Grid collapses to a single column on narrow screens.

Use stable viewport/dvh and safe-area-aware sheet padding. Actual Telegram content-safe-area layout belongs to Step 2, not this specimen. Never use a raw fixed 100vh. Keep scrolling vertical and leave sufficient space around active glass lenses. Do not clip menus inside overflow-hidden cards.

## 6. Depth and motion

Radii: 10/14/20/28px and pill, defined only in tokens. Use grouping, separators and materials before shadows. Glass belongs over rich content; the specimen's hero, primary CTA stage and navigation stage sit on original gradients. Quiet surfaces are solid. Borders and restrained material shadows distinguish elevation.

Material capability check uses CSS.supports(backdrop-filter), prefers-reduced-transparency and a manual solid switch. Unsupported/reduced-transparency takes precedence over user preference. Solid mode retains actual Glisse controls, removes backdrop/SVG filters and background refraction, restores selected labels, and preserves roles and hit areas. CSS preference fallback works before hydration. This is a compatibility escape hatch, not a device-performance certification; mid-range Android measurement remains a Step 4 task.

App motion: instant 0ms, fast 140ms, normal 240ms, slow 400ms, skeleton 1600ms. Standard cubic and spring-like easing are tokens. Shared app spring targets: stiffness 380, damping 32, mass 0.8; MotionConfig honors reduced motion. Later route transitions must read these tokens through a shared adapter. Glisse owns its internal physics; 0.5.0 does not expose spring configuration. Do not patch dependencies or claim those physics are app-token driven.

Reduced motion: CSS animations/transitions stop; tab/segment lens overlays are hidden and selected-state color is static; Glisse's inspected createSpring implementation also snaps to its target when prefers-reduced-motion is active. Menu visual morph is flattened. Production performance approval still requires the Step 4 Android pass.

### Haptics map (implementation in Step 2)

| Event                        | Telegram action                             |
| ---------------------------- | ------------------------------------------- |
| Tab/segment/switch selection | selectionChanged                            |
| Primary action               | impactOccurred light                        |
| Purchase success             | notificationOccurred success                |
| Error                        | notificationOccurred error                  |
| Destructive confirmation     | impactOccurred heavy / notification warning |

One typed adapter, version guards and user preference; no calls on initial render. There are no Telegram SDK calls in Step 1.

## 7. Do / Don't

Do use token names, real Glisse controls, visible focus, accessible names, semantic containers and genuine loading/empty/error examples. Do check light/dark and text scaling. Do preserve keyboard navigation and library aria props.

Do not copy proprietary logos/fonts; draw decorative assets locally. Do not put glass on every flat card. Do not hide errors only in toasts. Do not encode information only in color. Do not add backend calls, checkout behavior or real user identity before the scheduled phases. Do not treat a gallery screenshot as customer UI approval.

## 8. Responsive and accessibility

Baseline: 360×800, 390×844, 430×932 in light/dark. Larger layouts retain the mobile visual system, with a three-column state specimen only at wider widths. WCAG AA is checked with axe plus keyboard interactions, focus, target size and overflow assertions. Respect OS motion/transparency, browser zoom and safe areas. Manual theme changes must work even when OS preference is the opposite.

Screenshots are in docs/screens/step-01; tests can regenerate with CAPTURE_SCREENS=1. Do not compare screenshots blindly across different browser/font rendering environments. Record actual QA outcomes in PLANS.md.

## 9. Agent prompt guide

Before a new screen, read this file, tokens.css, AGENTS.md and the current plan. Choose semantic tokens and existing primitives first. Read exact installed external types before using APIs. Create one focused screen with every meaningful state, then run lint/typecheck/unit/build/browser, inspect required screenshots and fix visible defects. Update this system only for reusable decisions. Step 4 requires explicit UI approval before backend work.

### Glisse gaps and limits

| Missing capability or constraint                                       | Resolution                                                                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Text, Surface, Badge, Avatar, grouped rows, skeleton and progress ring | Custom semantic primitives using this palette, radii and rhythm                                                                |
| Bottom sheet and toast                                                 | Vaul/Radix and Sonner styled with our tokens; Glisse supplies triggers/close actions                                           |
| Button loading prop                                                    | ActionButton wraps Button; disabled while aria-busy, keeps readable label                                                      |
| 40px default targets / small search-clear hit area                     | CSS adapts to 44px minimum without changing vendor semantics                                                                   |
| No global theme/provider/solid material switch                         | MaterialProvider and semantic --lg-* mapping plus CSS fallback                                                                 |
| No disabled prop for Menu/TabBar/SegmentedControl roots                | Native disabled fieldset in specimen; individual app flows should omit unavailable navigation or wrap a disabled control group |
| No public spring/reduced-motion configuration                          | Glisse springs honor reduced motion natively; CSS additionally suppresses decorative lens/morph motion                         |
| No image fallback orchestration                                        | Initials Avatar now; Telegram-photo integration later                                                                          |
| No tablet/desktop admin layouts                                        | Later admin phase uses the same tokens with the documented macOS/iPadOS structural patterns                                    |

## Step 2 — Shell implementation notes

The customer route group has a persistent TelegramProvider, material provider and navigation context. The large-title header collapses by actual element geometry; the compact toolbar is sticky and respects reduced transparency. Glisse TabBar uses real Next links and aria-current, while root tabs omit a Back button. Nested direct links have in-app parent fallbacks.

System/content safe-area maxima are evaluated on the shell where host CSS variables are inherited; system top plus content top and system bottom plus content bottom reserve their respective chrome. Viewport height uses the validated stable host height, then Telegram's stable-height variable, then dvh. Only the central main pane scrolls; the dock remains in its own layout row. The dock's original indigo/blue material background gives glass rich content to refract.

RouteFrame reads spring stiffness/damping/mass and 32px travel from CSS tokens. Push/pop directions use interruptible Motion entry transitions with one active route pane. The previous pane is removed immediately: retaining Next router slots for exit animation duplicated the newly resolved content, so it is intentionally not done. Focus moves to the new screen heading and scroll position resets. OS reduced motion disables these transitions.

App buttons call the shared, version-gated haptic map on interaction only. Navigation uses selection feedback. Haptics can be turned off in Profile → Sozlamalar. Native Main/Secondary buttons remain hidden until the checkout phase. Fullscreen is deliberately never requested. Vaul sheets suspend vertical swipes only while open, restore the previous setting, and take precedence over route Back.

Browser dev mode is labelled, in-memory and compiled out of production. Production outside Telegram has no fake profile. Unsafe Telegram user data is presentation-only, not an auth/session/role. Photo rendering, all customer screen content and persistent identity arrive in their assigned later steps. SDK loading errors have a retry state; offline state resumes after a connection returns. These browser checks do not certify a real Telegram client; see docs/TELEGRAM_TESTING.md.
