# API Specification (REST)

Base: `/api` · Auth: NextAuth session (JWT) · All bodies JSON.

## Auth

`GET|POST /api/auth/[...nextauth]` — NextAuth (Google OAuth wired; add
email magic-link by config). Session attaches `user.id`.

## Predictions

### GET /api/predictions
Returns the signed-in user's prediction.
- `200 { prediction: Prediction | null }`
- `401` if anonymous.

### PUT /api/predictions  (autosave endpoint)
Upserts the user's prediction. Called fire-and-forget on stage
transitions; client remains offline-first.

Request:
```json
{
  "groupRankings": { "A": ["MEX","KOR","RSA","CZE"], "...": [] },
  "qualifiedThirdGroups": ["A","C","E","F","H","I","J","L"],
  "matchWinners": { "73": "SUI", "104": "FRA" }
}
```
Server re-validates everything (team∈group, no duplicates, third-combination
allocatable, winner∈match) and derives `championTeamId`, `confidence`,
`isComplete` — the client never sends derived fields.

- `200 { prediction }` · `204` anonymous (local-only) · `400` malformed ·
  `422` semantically invalid.

## Leaderboard

### GET /api/leaderboard?limit=50&cursor=<id>
Cursor-paginated, complete predictions ordered by `score desc,
submittedAt asc` (earlier identical scores rank higher).
```json
{ "entries": [{ "id", "score", "championTeamId", "confidence",
                "user": { "handle", "image" } }], "nextCursor": null }
```

### Scoring rubric (results worker)
Recompute on every `MatchResult` insert:

| Hit | Points |
|---|---|
| Exact group position (each) | 2 |
| Qualified third-place team (each) | 3 |
| Correct R32 winner | 4 |
| Correct R16 winner | 6 |
| Correct QF winner | 10 |
| Correct SF winner | 15 |
| Correct third-place winner | 10 |
| Correct finalist (each) | 15 |
| Correct champion | 40 |

Max ≈ 96 (groups) + 24 (thirds) + 64 + 48 + 40 + 30 + 10 + 30 + 40 = 382.
Store per-round detail in `Prediction.scoreBreakdown` for transparency.

## Analytics

### POST /api/analytics
`{ "name": "bracket_generated", "payload": { ... } }` → `204`.
Allowed names enumerated server-side (see route). Funnel:
`welcome_cta_clicked → group_completed ×12 → thirds_completed →
bracket_generated → round_completed ×5 → champion_revealed → share_clicked`.

## Results administration (future)
`MatchResult` table is in the schema; add an admin-guarded
`PUT /api/results/:matchNumber` plus a scoring job (cron/queue) for
go-live. The official match numbering (1–104) is the join key everywhere.
