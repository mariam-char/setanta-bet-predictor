# Design System & Component Library

Setanta Bet brand: black broadcast canvas, Setanta yellow primary,
Setanta red secondary, premium glass surfaces, condensed shouting type
for moments, quiet humanist type for everything else. The wordmark is
recreated in CSS (`SetantaLogo`) and appears on the welcome hero, the
sticky progress bar, and the dashboard.

## Color tokens (Tailwind: `tailwind.config.ts`)

| Token | Hex | Use |
|---|---|---|
| `pitch.950` | `#0D0D0D` | Page background (Setanta black) |
| `pitch.900–600` | `#141414 → #323238` | Elevation steps |
| `volt` | `#FFD200` | Setanta yellow — primary action, picked state, progress |
| `broadcast` | `#FA5C5C` | Setanta red — runner-up accents, ambient washes |
| `gold` | `#FFC83D` | Trophy glow only (wildcard/3rd uses white tints to avoid clashing with brand yellow) |
| `danger` | `#FF3B57` | Validation, destructive |
| `ink / ink.dim / ink.faint` | `#F4F6FB / #9AA3B8 / #5B6478` | Text hierarchy |

Contrast: volt-on-pitch950 ≈ 17:1, ink-on-pitch950 ≈ 16:1, ink.dim ≈ 7:1 —
all AA/AAA. Volt is never used for body text on light surfaces.

## Typography

- **Display — Archivo Black** (`--font-display`): hero headlines, group
  letters, stat numbers. Always uppercase, tracking-tight for hero
  (`heading-hero`), tracking-widest for micro-labels.
- **Body — Inter** (`--font-body`): everything else. 12–16px scale on
  mobile; never below 11px except decorative micro-tags.

## Surfaces & depth

- `.glass` — radius 20px, `bg-white/4`, `border-white/10`, `backdrop-blur-xl`,
  layered shadow + inner top highlight. The only card surface.
- `.glass-hover` — +3% fill, +10% border on hover.
- Glow shadows (`shadow-voltGlow`) reserved for primary CTA and picked states.

## Core components (`src/components/`)

| Component | Responsibility | Key states |
|---|---|---|
| `SetantaLogo` | CSS wordmark, 3 sizes | — |
| `TeamChip` | Flag + name, 3 sizes | muted (eliminated) |
| `GroupCard` | dnd-kit sortable 4-row ranking | position-tinted rows (volt/blue/gold/faded), dragging lift, keyboard sortable, ▲▼ fallback buttons |
| `MatchCard` | Two-sided tap-to-pick match | empty slot label, picked (volt ring + ✓), eliminated (40% opacity) |
| `BracketView` | Responsive bracket shell | mobile round tabs / desktop pan+zoom canvas |
| `ProgressBar` | Sticky journey progress | spring-animated width, aria-progressbar |
| `AchievementToast` | Badge unlock toasts | queued, auto-dismiss 2.8s, aria-live |

## Buttons

- `.btn-primary` — volt fill, pitch-950 text, uppercase display type,
  volt glow, scale-down on press. One per viewport ideally.
- `.btn-ghost` — 15% white border, transparent. Secondary nav.
- All buttons: ≥44px touch target, visible `focus-visible` volt outline.

## Mobile vs desktop screens

| Screen | Mobile (default) | Desktop (md/lg+) |
|---|---|---|
| Groups | 2 groups/page, paging dots, bottom nav | 2–3 column grid, single CTA row |
| Summary | 2-col qualifier grid, sticky 8/8 counter | 4-col grid |
| Bracket | Round tabs, single column of cards | 6-column bracket, pan + zoom |
| Champion | Full-screen takeover | Same, larger type |
| Dashboard | Stacked stat cards | 4-up stats, full bracket |

## Iconography & imagery

Emoji flags (zero-asset, universally rendered, real flag colors) with
`aria-hidden` + text labels for screen readers. Stadium atmosphere comes
from gradients and light beams, not photography — keeps LCP small and the
look ownable. Swap-in path: replace `Team.flag` with an SVG sprite URL.
