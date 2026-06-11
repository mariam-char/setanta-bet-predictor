# Gamification Strategy & Accessibility Guidelines

## Gamification

**Core loop:** predict → instant feedback (progress %, badges, confidence)
→ social proof (share card) → return trigger (leaderboard as results land).

1. **Completion progress** — sticky bar, weighted 45% groups / 5%
   wildcards / 50% knockout so the meter moves fast early (hook) and the
   final picks feel consequential.
2. **Achievement badges** (10) — milestone badges (Opening Whistle →
   Crystal Ball) reward forward motion; personality badges (Chalk Master,
   Agent of Chaos) reward *how* you predicted, giving every style a win.
   Sticky once unlocked; toasts on unlock; gallery on dashboard.
3. **Confidence score** — favorites-vs-upsets ratio (0–100). Reframes
   "risk" as identity ("Bold Caller"), is shareable, and seeds banter.
4. **Milestone celebrations** — round-completion toasts crescendo to the
   full-screen champion reveal. One big payoff > many small ones.
5. **Social share cards** — emoji-rich native-share text today; OG-image
   endpoint (`/api/og?prediction=…`) is the designed next step for visual
   cards on social.
6. **Leaderboard-ready** — scoring rubric + indexes already in schema/API.
   Tournament-time loop: result lands → scores recompute → push/email
   "You climbed 212 places" → re-engagement. Pools ("leagues with mates")
   are the V2 multiplier.

## Accessibility (WCAG 2.2 AA)

**Perceivable**
- Text contrast ≥ 7:1 for primary text, ≥ 4.5:1 for dim text on pitch-950.
- Color never sole signal: positions get text tags (1st–4th), picked
  state gets ✓ + ring + bold, wildcards get "3rd · In" text.
- Emoji flags are `aria-hidden`; team names always rendered as text.

**Operable**
- Full keyboard: dnd-kit keyboard sensor (space to lift, arrows to move)
  plus explicit ▲▼ buttons as a zero-learning-curve alternative; all
  pick targets are real `<button>`s ≥ 44px.
- Bracket pan ignores pointer events originating on buttons, so touch
  picking never fights panning; mobile gets tabs instead of pan/zoom.
- Visible `focus-visible` volt outlines everywhere; skip-to-content link.

**Understandable**
- One decision type per screen; rules stated in one line where applied.
- Gated CTAs explain themselves ("Pick every match to reveal…").
- `aria-pressed` on toggles, `aria-label`s carry full context
  ("Reorder Mexico, currently 1st in group A").

**Robust**
- Progress bar: `role="progressbar"` + value attrs. Toasts/counters:
  `aria-live="polite"`. Semantic landmarks (`main`, `section[aria-label]`,
  `ol` for rankings, tablist for rounds).
- `prefers-reduced-motion` collapses all animation globally.
- Color-scheme dark declared; zoom to 200% reflows without loss.
