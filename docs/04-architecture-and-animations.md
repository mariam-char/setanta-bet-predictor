# Component Architecture, State, Database & Animation Spec

## React component structure

```
app/
├─ layout.tsx                 fonts, skip-link, metadata
├─ page.tsx                   Welcome (Step 1)
├─ predict/
│  ├─ layout.tsx              ProgressBar + AchievementToast shell
│  ├─ groups/page.tsx         Step 2 — paging (mobile) / grid (desktop)
│  ├─ summary/page.tsx        Step 3 — qualifiers + wildcard toggles
│  ├─ bracket/page.tsx        Step 4 — gate + BracketView + reveal CTA
│  └─ champion/page.tsx       Step 5 — celebration
├─ dashboard/page.tsx         Step 6 — stats, badges, recap, share
└─ api/…                      route handlers (see 03-api-spec.md)

components/  TeamChip · GroupCard · MatchCard · BracketView
             · ProgressBar · AchievementToast
lib/         teams (data) · bracket (engine) · confidence · achievements
             · db (Prisma) · auth (NextAuth)
store/       predictionStore (Zustand + persist)
```

## State management (Zustand)

Single store, single persisted slice (`wc26-prediction-v1`). Derived data
(resolved bracket, progress, confidence, achievements) is always computed
from the canonical trio — `groupRankings`, `qualifiedThirdGroups`,
`matchWinners` — never duplicated into state.

Invariant enforcement lives in the store: every mutation re-resolves the
bracket and prunes picks that became unreachable (e.g. demoting a team
from 2nd to 4th clears their knockout run, and only theirs). This is what
makes "edit any previous step at any time" safe.

## Bracket engine (`lib/bracket.ts`)

- `MATCHES`: the official FIFA match tree, M73–M104, encoded as slot
  references (`groupWinner`, `groupRunnerUp`, `thirdPlace(allowed[])`,
  `matchWinner`, `matchLoser`).
- `allocateThirds()`: deterministic backtracking matcher that assigns the
  8 qualified third-placed groups to the 8 constrained slots (FIFA's
  Annex C defines 495 valid combinations; the matcher produces a valid
  allocation for every one — slots with fewest options first,
  alphabetical tie-break).
- `resolveBracket()`: one pass over the tree producing render-ready
  matches; the third-place playoff resolves via `matchLoser` refs.

## Database schema (PostgreSQL via Prisma)

See `prisma/schema.prisma`. Entities: `User/Account/Session` (NextAuth),
`Prediction` (JSONB picks + derived `championTeamId`, `confidence`,
`score`, `scoreBreakdown`), `MatchResult` (official numbering 1–104),
`AnalyticsEvent`. Indexes on `score` (leaderboard) and `championTeamId`
("who picked whom" aggregates). One prediction per user via unique
constraint — relax to support multi-entry pools.

## Animation specification (Framer Motion)

| Moment | Spec | Why |
|---|---|---|
| Welcome hero | Stagger children 120ms, spring y:24→0 | Broadcast-intro energy |
| Group page change | x:±32 fade, 200ms, `mode="wait"` | Direction = progress |
| Drag reorder | dnd-kit FLIP transforms + lift shadow | Physical, instant |
| Progress bar | Spring stiffness 120, damping 20 | Tracks without lagging |
| Pick a winner | ✓ scale 0→1 spring; loser fades to 40% | Decisive feedback |
| Match card entry | y:8 fade, ~150ms | Subtle cascade |
| Achievement toast | Spring y:40 scale 0.9→1, hold 2.8s | Earned, not nagging |
| Trophy reveal | Scale 0 rot −8° → spring (stiff 120, damp 12), delay 250ms | The payoff moment |
| Confetti | 24 GPU-transform particles, 3.2–5.7s linear loops | Celebration without canvas cost |
| Reduced motion | Global media query kills all of the above | Accessibility |

Rules: animate only `transform`/`opacity`; springs for object motion,
duration-eases for fades; nothing blocks input; entrance delays ≤ 1.2s.
