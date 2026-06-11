# UX Flow, Information Architecture & User Journey

## 1. Full UX flow

```
Welcome (/)                         "Stay in the Game" hero, value prop, ~5 min estimate
   │  Create your prediction
   ▼
Group Stage (/predict/groups)       12 groups · drag-and-drop ranking 1st–4th
   │  Mobile: 2 groups per page (6 pages) · Desktop: full grid
   │  Auto-default order by seed so users refine rather than build from zero
   ▼
Qualification Summary (/predict/summary)
   │  24 automatic qualifiers shown · user toggles 8 of 12 third-placed teams
   │  Gate: all groups ranked + exactly 8 wildcards → "Generate knockout bracket"
   ▼
Knockout (/predict/bracket)         Official FIFA R32 seeding auto-generated
   │  R32 → R16 → QF → SF → Third place → Final (tap-to-pick winners)
   │  Mobile: one round at a time · Desktop: full bracket, pan + zoom
   ▼
Champion Reveal (/predict/champion) Full-screen celebration, trophy, confetti
   ▼
Dashboard (/dashboard)              Champion, finalists, semis, badges, confidence,
                                    full bracket + group recap · Share / Edit / Save
```

Every action auto-saves locally (Zustand persist) and syncs to the API for
signed-in users. Every stage is re-enterable; upstream edits prune only the
downstream picks they invalidate.

## 2. Information architecture

- **/** — Welcome. Zero state, single CTA, no nav chrome.
- **/predict/** — The prediction journey shell: sticky progress bar + achievement toasts.
  - **/predict/groups** — Step 2.
  - **/predict/summary** — Step 3. Qualification review + wildcard selection.
  - **/predict/bracket** — Step 4. Knockout picks.
  - **/predict/champion** — Step 5. Reveal moment.
- **/dashboard** — Step 6. Results hub; entry point for share/edit/reset.
- **/api/** — predictions (GET/PUT), leaderboard (GET), analytics (POST), auth.

Navigation model: a strictly linear "happy path" with permissive back-edges.
Users can jump backwards at any time; forward motion is gated only by
completeness (groups → summary → bracket → champion).

## 3. User journey map

| Stage | User goal | Emotion target | Touchpoints | Risks | Mitigations |
|---|---|---|---|---|---|
| Discover | "What is this?" | Curiosity → excitement | Hero, 3-step explainer, time estimate | Bounce from perceived effort | "~5 minutes", auto-save promise |
| Groups | Rank 48 teams fast | Flow, control | Drag-drop, seeded defaults, paging dots | Fatigue at group 7+ | Defaults = refine not build; 2 per page; progress bar always visible |
| Summary | Sanity-check, pick wildcards | Anticipation | Qualifier grid, 8/8 counter | Confusion about thirds rule | One-line rule copy, live counter, gated CTA |
| Bracket | Call every match | Rising stakes | Tap-to-pick cards, round tabs, zoom/pan | Lost on mobile | Round-at-a-time mobile view |
| Reveal | Payoff | Delight | Trophy spring, confetti, stat chips | Anticlimax | Full-screen takeover, staged animation |
| Dashboard | Own + share it | Pride | Share card, badges, recap | Dead end | Edit loops back, leaderboard hook |

## 4. Wireframes (lo-fi)

```
MOBILE — Groups                      MOBILE — Bracket
┌────────────────────┐               ┌────────────────────┐
│ ▓▓▓▓▓▓░░░░  42%    │  progress     │ ▓▓▓▓▓▓▓▓░░  78%    │
│ GROUP STAGE.       │               │ [R32][R16][QF][SF] │  round tabs
│ ┌────────────────┐ │               │ ┌────────────────┐ │
│ │ GROUP A        │ │               │ │ M73            │ │
│ │ 1st 🇲🇽 Mexico ⠿│ │  drag rows    │ │ 🇨🇭 Switzerland✓│ │  tap to pick
│ │ 2nd 🇰🇷 Korea  ⠿│ │               │ │ ─────────────  │ │
│ │ 3rd 🇿🇦 S.Afr. ⠿│ │               │ │ 🇧🇦 Bosnia      │ │
│ │ 4th 🇨🇿 Czech  ⠿│ │               │ └────────────────┘ │
│ └────────────────┘ │               │ … 15 more cards    │
│ ┌─ GROUP B ──────┐ │               │                    │
│ └────────────────┘ │               │ [Reveal champion]  │
│ ←Back  ●●○○○○ Next→│               └────────────────────┘
└────────────────────┘
DESKTOP — Bracket: 6 columns (R32→Final), pan canvas, zoom −/+,
third-place card docked under the Final column.
```

## 5. High-fidelity UI

The shipped code IS the hi-fi design: dark stadium-night canvas
(`#05070D`) with broadcast-blue and volt radial washes, glassmorphism
cards (blur-xl, 4% white fill, 10% white border), volt (#D9FF2E) primary
accent, Archivo Black display type set in uppercase with tight leading,
Inter for UI copy. See `02-design-system.md` for tokens and
`src/app/globals.css` for the implementation.
