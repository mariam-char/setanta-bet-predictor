# ⚽ Stay in the Game — 2026 World Cup Bracket Predictor

Predict the entire 2026 FIFA World Cup — the real 48-team draw, all 12
groups, the official Round-of-32 seeding (FIFA matches 73–104, including
best-third allocation), through to the final at MetLife Stadium.

Dark, broadcast-grade UI: stadium-night canvas, volt accent, glass
cards, Framer Motion micro-interactions. Mobile-first, one-handed,
auto-saving, fully editable at any stage.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS ·
Framer Motion · dnd-kit · Zustand (persisted) · NextAuth · Prisma ·
PostgreSQL · Zod.

## Quick start

```bash
npm install
cp .env.example .env          # set DATABASE_URL + NEXTAUTH_SECRET
npx prisma db push            # create tables (optional for local play —
                              # the app is offline-first without a DB)
npm run dev                   # http://localhost:3000
```

The prediction journey works fully anonymously (local persistence);
signing in syncs to PostgreSQL and joins the leaderboard.

## Project map

```
src/lib/teams.ts        Real 2026 draw — 48 teams, 12 groups, seeds
src/lib/bracket.ts      Official match tree M73–M104 + third-place allocator
src/store/…             Zustand store: autosave, invariant pruning
src/app/…               Welcome → Groups → Summary → Bracket → Champion → Dashboard
src/app/api/…           REST: predictions, leaderboard, analytics, auth
prisma/schema.prisma    PostgreSQL schema (leaderboard + results ready)
docs/                   UX flow & IA · design system · API spec ·
                        architecture & animations · gamification & a11y
```

## Notes

- Third-place R32 allocation follows the FIFA slot constraints; the
  deterministic matcher yields a valid allocation for all 495 published
  combinations (Annex C).
- Editing any earlier stage prunes only the knockout picks it
  invalidates — everything else survives.
