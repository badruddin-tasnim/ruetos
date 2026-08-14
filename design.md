# RUET OS — Design System

This document defines the complete visual language for the platform. It is macOS-**inspired** in structure only (menu bar, dock, draggable windows) — the visual treatment is **flat and modern**, closer to Linear, Raycast, or Vercel's dashboard than to macOS Aqua/glassmorphism. No `backdrop-filter`, no translucency layering, no blur. This keeps the build fast and cheap: solid colors, crisp 1px borders, and restrained shadows do all the work. Follow these tokens exactly everywhere so the product feels like one designed system.

---

## 1. Design Philosophy & Signature Element

**Concept: "Circuit Line."** RUET is an engineering university — the visual identity borrows from PCB (printed circuit board) traces and schematics, expressed through flat geometry instead of texture: thin solid accent lines, right-angle connectors, and small "node" dots at edges and corners. This is the one deliberate signature, used with restraint (never on every element at once):
- A **1px solid accent line** runs along the bottom edge of the menu bar and the top edge of the dock.
- Connector lines in the Mind Map use right-angle/orthogonal routing (not smooth curves) — like traces on a board.
- A small filled dot marks the active window and the active dock app.

**Deviations from macOS (intentional, not accidental):**
- No traffic-light dots. Window controls are three simple flat icon-buttons (close / minimize / maximize) in a neutral color, no red/yellow/green.
- No photographic or blurred wallpaper — a flat solid-color desktop background with optional faint static line pattern (§7), no animation required.
- Dock icons are flat rounded-square glyphs with solid (not gradient, not glass) fills — one solid color per app.
- All surfaces are fully opaque. Nothing is translucent. This is the core simplification versus the earlier glass direction.

---

## 2. Color System

Six core named colors. Do not introduce new hex values outside this palette without deriving them as tints/shades of these.

| Name | Hex | Usage |
|---|---|---|
| **Ink Navy** | `#0B1120` | Desktop background, menu bar, dock — solid, no opacity |
| **Signal Blue** | `#4C7DFF` | Primary accent — buttons, links, focus rings, active states |
| **Circuit Teal** | `#14E8B4` | Secondary accent — signature trace line, success/mastered states |
| **Cloud White** | `#F7F9FC` | Window and card backgrounds — solid |
| **Graphite** | `#1E2430` | Primary text on light surfaces |
| **Slate** | `#6B7280` | Secondary text, borders, dividers, disabled states |

**Semantic colors** (data meaning only — importance, performance, status):

| Meaning | Hex | Where |
|---|---|---|
| High importance / weak performance / urgent | `#FF6B5C` (Coral) | Mind map high nodes, weak-topic flags, urgent notices |
| Medium importance / moderate performance | `#FFB454` (Amber) | Mind map medium nodes, mid-range mastery bars |
| Low importance / strong performance / success | `#14E8B4` (Circuit Teal) | Mind map low-importance nodes, mastered topics, confirmations |
| Neutral / inactive | `#8B96A5` (Muted Slate) | Disabled tags, no-data states |

**Borders and dividers** (flat, solid, no opacity tricks beyond simple tints):
- On light surfaces: `#E4E7EC` (a fixed Slate tint, not computed opacity)
- On dark surfaces: `#1F2937` (a fixed Ink Navy tint)

**Never use:** pure black `#000000`, pure white `#FFFFFF`, warm cream/beige, terracotta/orange as a primary accent, or any `rgba()` opacity layering for surfaces — every surface color should be a flat, solid hex value from this table so there's nothing to composite at render time.

---

## 3. Typography

Three type roles:

| Role | Typeface | Fallback stack | Usage |
|---|---|---|---|
| **Display** | General Sans | `"General Sans", "Inter", -apple-system, sans-serif` | Window titles, app headers, login title, dashboard hero numbers |
| **Body** | Inter | `"Inter", -apple-system, "Segoe UI", sans-serif` | Paragraphs, labels, buttons, form fields |
| **Utility/Data** | JetBrains Mono | `"JetBrains Mono", "SF Mono", monospace` | Roll/registration numbers, clock, appearance counts, percentages |

Both are free Google Fonts — no licensing issues, load via `<link>` or `@font-face` from Google Fonts CDN.

**Type scale** (px):

| Token | Size | Line height | Weight | Usage |
|---|---|---|---|---|
| `display-xl` | 40px | 1.1 | 600 | Login screen title only |
| `display-lg` | 28px | 1.2 | 600 | Window/app main headers |
| `display-md` | 22px | 1.25 | 600 | Section headers within a window |
| `body-lg` | 16px | 1.5 | 400/500 | Primary body text, card titles |
| `body-md` | 14px | 1.5 | 400 | Standard UI text, buttons, labels |
| `body-sm` | 13px | 1.45 | 400 | Secondary text, dock tooltips |
| `caption` | 12px | 1.4 | 500 | Tags, badges, timestamps, eyebrow labels |
| `mono-md` | 14px | 1.4 | 500 | Data values (percentages, counts) |
| `mono-sm` | 12px | 1.4 | 500 | Menu bar clock, roll number chip |

Weight rules: 400 for reading text, 500 for UI labels/buttons/data, 600 for headers only — never go above 600.

---

## 4. Spacing & Layout Grid

Base unit: **4px**. All margin/padding/gap values must be multiples of this scale.

| Token | Value | Typical use |
|---|---|---|
| `space-1` | 4px | Icon-to-label gaps, tight inline spacing |
| `space-2` | 8px | Compact padding, chip/badge padding |
| `space-3` | 12px | Form field padding, small card padding |
| `space-4` | 16px | Standard component padding |
| `space-6` | 24px | Section padding, gap between unrelated elements |
| `space-8` | 32px | Window content padding |
| `space-12` | 48px | Login card padding |
| `space-16` | 64px | Desktop-level spacing (dock offset from bottom edge) |

**Border radius scale:**

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Chips, badges, small buttons |
| `radius-md` | 12px | Inputs, buttons, list items |
| `radius-lg` | 16px | Cards, dock container |
| `radius-xl` | 20px | Windows, login card, mind map node cards |
| `radius-full` | 999px | Avatars, pill toggles, status dots |

**Layout:**
- Menu bar: fixed top, full width, height `48px`, solid Ink Navy.
- Dock: fixed bottom, horizontally centered, floating `space-4` above the bottom edge, height `64px`, solid Ink Navy, `radius-lg`.
- Windows: default ~`900x600px` for content apps (AI Exam Prep, Mind Map), ~`560x680px` for narrower apps (Study Buddy). Minimum width `480px`. Centered on first open; cascade `space-6` offset for each subsequent window.
- Content max-width inside windows: `1040px`, centered, `space-8` horizontal padding.
- Design for minimum viewport `1280px` wide (laptop demo product, not mobile-first).

---

## 5. Elevation (Flat Shadow System — no blur)

Only two shadow levels, both cheap, no `backdrop-filter` anywhere in the product:

| Level | Box shadow | Used for |
|---|---|---|
| **Resting** | `0 1px 2px rgba(11,17,32,0.06), 0 1px 0 rgba(11,17,32,0.04)` | Cards, list items, inputs at rest |
| **Raised** | `0 8px 24px rgba(11,17,32,0.16)` | Windows, open dropdowns, popovers, hovered cards |

Windows and popovers also get a fixed `1px` solid border (`#E4E7EC` on light surfaces) instead of relying on shadow alone to separate them from the background — this reads clearly even without blur.

The dock and menu bar use **no shadow**, since they're solid Ink Navy against a solid dark desktop background — a `1px` bottom/top border in `#1F2937` is enough separation.

---

## 6. Component Specifications

### 6.1 Login Screen
- Full-viewport solid Ink Navy background, optional faint static line pattern (§7) — no animation required, no blur.
- Centered card: Cloud White, `420px` wide, `radius-xl`, `space-12` padding, Raised shadow, `1px` `#E4E7EC` border.
- RUET monogram in a `64px` solid Signal Blue circle at top.
- Title: `display-xl`, "RUET OS", Graphite.
- Two stacked inputs (`space-4` gap): **Roll Number**, **Registration Number**, `mono-md` font (§6.5 input style).
- Primary button (§6.6), full width, label "Unlock".
- On submit: button shows inline spinner + "Unlocking…", then the card does a simple `200ms` opacity fade-out as the desktop fades in — no scale/blur transition needed, a plain crossfade reads clean and costs nothing.

### 6.2 Menu Bar
- Solid Ink Navy, `48px` height, full width, fixed top, `1px` bottom border in the Circuit Teal accent color (this is the signature trace line — a plain solid `1px` line, no glow/animation needed).
- Left: RUET monogram + active app name (`body-md` medium, Cloud White).
- Right: student name (`body-sm`, Cloud White at reduced-but-solid tint `#C4CAD6`) + roll number chip (`mono-sm`, `radius-sm`, solid `#1F2937` background) + live clock (`mono-sm`).

### 6.3 Dock
- Solid Ink Navy, `radius-lg`, floating `space-4` above bottom edge, horizontally centered, auto-width, `1px` top border in Circuit Teal (mirrors the menu bar's line — the two flat trace lines visually "close the circuit" between top and bottom chrome).
- Icons: `44px` rounded-squares (`radius-md`), solid single-color fill per app (not gradients) — e.g., AI Exam Prep = Signal Blue, Study Buddy = Coral, Mind Map = Circuit Teal, Class Routine = Slate, Notices = Amber. White line-icon centered, `20px`.
- Hover: icon scales to `1.1x`, `120ms` ease-out — a simple transform, no neighbor-displacement physics needed (cheaper, still reads as responsive).
- Click: icon does one quick bounce (translateY `-8px → 0`, `250ms`, ease-out) before its window opens.
- Active/open apps: small solid Circuit Teal dot centered below the icon.

### 6.4 Windows
- Solid Cloud White, `radius-xl`, `1px` `#E4E7EC` border, Raised shadow.
- Title bar: `40px` height, solid `#F0F2F6` (a slightly darker flat tint of Cloud White, not opacity-based), app name centered (`body-md` medium).
- Window controls: three small flat icon-buttons (✕ minimize/maximize glyphs) grouped left, neutral Slate at rest, each turns solid Coral/Amber/Teal only on hover of that specific button (not the whole cluster) — a simple `color` transition, `100ms`, no fade layering.
- Title bar is the drag handle (`cursor: grab`).
- Window open: opacity `0→1` + `translateY(8px → 0)`, `200ms`, ease-out-expo. No scale transform — cheaper and just as effective.
- Window close: reverse, `150ms`.
- Minimize: translate toward the dock icon position + fade, `250ms`, ease-out-expo.
- Focus state: focused window gets a `2px` solid Signal Blue top border (replacing the earlier glow-ring idea — a solid border costs nothing extra); unfocused windows drop to a flat `#FAFBFC` title bar tint, no opacity dimming of content (avoids compositing cost).

### 6.5 Inputs & Forms
- `radius-md`, `44px` height, solid Cloud White background, `1px` solid `#E4E7EC` border.
- Focus: border becomes `1.5px` solid Signal Blue, plus a fixed (non-blurred) `3px` solid `#DCE6FF` outer ring — implement as `box-shadow: 0 0 0 3px #DCE6FF` (solid color, not rgba) for consistency and simplicity.
- Placeholder: solid `#9AA3B2`, `body-md`.
- Label above field: `caption`, weight 500, Graphite, `space-1` gap above field.

### 6.6 Buttons
- **Primary**: solid Signal Blue background, Cloud White text, `radius-md`, `body-md` medium, `space-3`/`space-4` padding. Hover: solid darker shade `#3D68E0` (a fixed hex, not computed brightness). Active/press: `translateY(1px)`.
- **Secondary**: solid Cloud White background, `1px` solid Slate border, Graphite text. Hover: solid `#F0F2F6` background.
- **Ghost/icon button**: transparent at rest; hover shows solid `#F0F2F6` background, `radius-sm`.
- All buttons: `120ms` ease-out for hover/press, standard curve `cubic-bezier(0.4, 0, 0.2, 1)`.

### 6.7 Cards & List Items
- Solid Cloud White, `radius-lg`, `1px` solid `#E4E7EC` border, Resting shadow, `space-4` padding.
- Hover (clickable cards): shadow steps up to Raised, no transform/lift needed — shadow-only hover is cheap and still reads as interactive.
- List items (tutor rows, notice rows): no card border, just a `1px` solid `#E4E7EC` bottom divider between rows, `space-3` vertical padding. Hover: solid `#FAFBFC` background.

### 6.8 Mind Map Nodes (Course Mind Map app)
- Chapter nodes (root branches): `radius-lg` card, solid `#EAF0FF` background (fixed Signal-Blue tint), `1.5px` solid Signal Blue border, `body-lg` medium text.
- Topic nodes: `radius-md` card, solid Cloud White, `1px` solid `#E4E7EC` border, `body-md` text.
- Subtopic (leaf) nodes: `radius-md` card, background = a **fixed light tint hex** of the importance color (not computed opacity) — pre-define these three: Coral tint `#FFE9E6`, Amber tint `#FFF3E0`, Teal tint `#E3FBF4`. Border = `1.5px` solid full-strength importance color. Small `caption` badge with appearance count, `mono-sm`, `radius-full` chip.
- Connector lines: `1.5px` solid `#C4CAD6`, **orthogonal/right-angle routing** (not bezier curves) — this reinforces the circuit-trace motif and is simpler to implement than smooth curve math in most graph libraries (React Flow supports `step`/`smoothstep` edge types natively — use `step`).
- Expand/collapse: child nodes fade + `translateY(6px → 0)`, `15ms` stagger per node, `160ms` each, ease-out-expo.
- Node click (leaf): opens a small solid-white popover (Raised shadow, `1px` border), anchored to the node, `120ms` fade — no scale transform needed.

### 6.9 Progress Bars & Mastery Indicators
- Track: `8px` height, `radius-full`, solid `#E4E7EC`.
- Fill: `radius-full`, solid color by value — below 50% Coral, 50–75% Amber, above 75% Circuit Teal (same semantic mapping used everywhere in the product — Mind Map importance and AI Exam Prep mastery must stay visually consistent).
- Fill animates width `0 → target` on mount, `500ms`, ease-out-expo.

### 6.10 Badges, Tags, Tooltips
- Badge/tag: `caption`, `radius-sm`, `space-1`/`space-2` padding, background = the fixed light tint hex for that semantic color (§6.8 tint values), text = full-strength semantic color.
- Tooltip: solid Ink Navy background, Cloud White text, `caption`, `radius-sm`, `space-2` padding, appears after `350ms` hover delay, `100ms` fade — no blur, just a solid dark chip.

### 6.11 Empty & Error States
- Line icon (Slate) + `body-lg` message (Graphite) + optional `body-sm` helper (Slate), centered, `space-6` vertical padding.
- Plain, direct language stating what happened and the next action (e.g., "Gemini couldn't reach the model — retry?" with a retry button) — never a silent or vague failure.

---

## 7. Desktop Wallpaper (Signature Background)

- Solid Ink Navy fill. Optional: a faint **static** line pattern (fixed SVG background, not rendered/animated per-frame) suggesting circuit traces in `#14E8B4` at low opacity (~10%) or as a fixed pre-blended hex like `#122A25`-tinted lines — either way, this should be one static SVG or CSS background-image, not a live-animated canvas. No motion required here; keep the wallpaper cheap and let the dock/menu bar trace lines and dot indicators carry the "Circuit Line" identity instead.

---

## 8. Motion System (Global Rules)

Two easing curves cover the entire product:

| Curve | CSS value | Used for |
|---|---|---|
| **ease-out-expo** | `cubic-bezier(0.16, 1, 0.3, 1)` | Anything appearing/opening: windows, popovers, mind map nodes, progress bars, login fade |
| **standard** | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover/press micro-interactions, color changes, dock scale |

Duration scale:

| Token | Duration | Usage |
|---|---|---|
| `motion-instant` | 100–120ms | Hover states, focus rings, button color changes |
| `motion-fast` | 150ms | Button press, tooltip |
| `motion-base` | 160–200ms | Window open/close, node expand, popovers |
| `motion-slow` | 250ms | Minimize-to-dock, dock bounce |

All animations are simple `opacity`, `transform: translateY`, and `transform: scale` — never animate `box-shadow`, `filter`, or `backdrop-filter`, since those are the expensive properties this flat direction is specifically avoiding. This keeps every transition GPU-cheap and easy to implement with plain CSS transitions (no animation library strictly required, though Framer Motion is still fine to use if convenient).

**Respect `prefers-reduced-motion`:** disable the dock bounce and staggered node reveals; collapse window open/close to a plain opacity fade at `motion-fast`.

---

## 9. Iconography

- Single consistent line-icon set throughout (recommended: Lucide Icons — free, consistent stroke weight).
- Stroke width: `1.5px` at `20px` size, `2px` at `16px` or smaller — never mix stroke weights on one screen.
- Icons inherit their context's text color (Graphite on light surfaces, Cloud White on dark surfaces), except dock icons, which are always white on their solid fill.

---

## 10. Consistency Checklist (apply before considering any screen done)

- [ ] Only colors from §2 are used, and only per their semantic meaning (Coral never used decoratively — only for high-importance/weak/urgent).
- [ ] No `backdrop-filter`, no `rgba()`/opacity-based surface colors anywhere — every surface is a flat, solid hex value.
- [ ] Only the three typefaces from §3, only the defined type scale.
- [ ] All spacing on the 4px scale (§4) — no eyeballed padding.
- [ ] Only the two shadow levels from §5 — no custom/ad hoc shadows.
- [ ] All motion uses one of the two easing curves and the defined duration scale (§8), and only animates `opacity`/`transform`.
- [ ] The Circuit Line signature (solid trace lines on menu bar/dock edges, orthogonal mind-map connectors, active-state dots) appears — but only in these specific places, not sprinkled everywhere.
- [ ] Every focusable element shows the solid Signal Blue focus ring (§6.5).
