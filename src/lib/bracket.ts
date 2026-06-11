import type {
  GroupId,
  MatchDef,
  MatchId,
  PredictionState,
  ResolvedMatch,
  Round,
  SlotRef,
  Team,
  TeamId,
} from "@/types";
import { TEAMS_BY_ID } from "./teams";

/**
 * Official FIFA Round of 32 schedule (matches 73–88) and full knockout
 * tree through the final (match 104), per the published 2026 regulations.
 *
 * Third-place slots list the five groups whose third-placed team may be
 * allocated to them. The exact allocation among qualified thirds is
 * resolved with a constraint matching (see `allocateThirds`).
 */
export const MATCHES: MatchDef[] = [
  // Round of 32
  { id: 73, round: "R32", home: { kind: "groupRunnerUp", group: "A" }, away: { kind: "groupRunnerUp", group: "B" } },
  { id: 74, round: "R32", home: { kind: "groupWinner", group: "E" }, away: { kind: "thirdPlace", allowedGroups: ["A", "B", "C", "D", "F"] } },
  { id: 75, round: "R32", home: { kind: "groupWinner", group: "F" }, away: { kind: "groupRunnerUp", group: "C" } },
  { id: 76, round: "R32", home: { kind: "groupWinner", group: "C" }, away: { kind: "groupRunnerUp", group: "F" } },
  { id: 77, round: "R32", home: { kind: "groupWinner", group: "I" }, away: { kind: "thirdPlace", allowedGroups: ["C", "D", "F", "G", "H"] } },
  { id: 78, round: "R32", home: { kind: "groupRunnerUp", group: "E" }, away: { kind: "groupRunnerUp", group: "I" } },
  { id: 79, round: "R32", home: { kind: "groupWinner", group: "A" }, away: { kind: "thirdPlace", allowedGroups: ["C", "E", "F", "H", "I"] } },
  { id: 80, round: "R32", home: { kind: "groupWinner", group: "L" }, away: { kind: "thirdPlace", allowedGroups: ["E", "H", "I", "J", "K"] } },
  { id: 81, round: "R32", home: { kind: "groupWinner", group: "D" }, away: { kind: "thirdPlace", allowedGroups: ["B", "E", "F", "I", "J"] } },
  { id: 82, round: "R32", home: { kind: "groupWinner", group: "G" }, away: { kind: "thirdPlace", allowedGroups: ["A", "E", "H", "I", "J"] } },
  { id: 83, round: "R32", home: { kind: "groupRunnerUp", group: "K" }, away: { kind: "groupRunnerUp", group: "L" } },
  { id: 84, round: "R32", home: { kind: "groupWinner", group: "H" }, away: { kind: "groupRunnerUp", group: "J" } },
  { id: 85, round: "R32", home: { kind: "groupWinner", group: "B" }, away: { kind: "thirdPlace", allowedGroups: ["E", "F", "G", "I", "J"] } },
  { id: 86, round: "R32", home: { kind: "groupWinner", group: "J" }, away: { kind: "groupRunnerUp", group: "H" } },
  { id: 87, round: "R32", home: { kind: "groupWinner", group: "K" }, away: { kind: "thirdPlace", allowedGroups: ["D", "E", "I", "J", "L"] } },
  { id: 88, round: "R32", home: { kind: "groupRunnerUp", group: "D" }, away: { kind: "groupRunnerUp", group: "G" } },
  // Round of 16
  { id: 89, round: "R16", home: { kind: "matchWinner", match: 74 }, away: { kind: "matchWinner", match: 77 } },
  { id: 90, round: "R16", home: { kind: "matchWinner", match: 73 }, away: { kind: "matchWinner", match: 75 } },
  { id: 91, round: "R16", home: { kind: "matchWinner", match: 76 }, away: { kind: "matchWinner", match: 78 } },
  { id: 92, round: "R16", home: { kind: "matchWinner", match: 79 }, away: { kind: "matchWinner", match: 80 } },
  { id: 93, round: "R16", home: { kind: "matchWinner", match: 83 }, away: { kind: "matchWinner", match: 84 } },
  { id: 94, round: "R16", home: { kind: "matchWinner", match: 81 }, away: { kind: "matchWinner", match: 82 } },
  { id: 95, round: "R16", home: { kind: "matchWinner", match: 86 }, away: { kind: "matchWinner", match: 88 } },
  { id: 96, round: "R16", home: { kind: "matchWinner", match: 85 }, away: { kind: "matchWinner", match: 87 } },
  // Quarter-finals
  { id: 97, round: "QF", home: { kind: "matchWinner", match: 89 }, away: { kind: "matchWinner", match: 90 } },
  { id: 98, round: "QF", home: { kind: "matchWinner", match: 93 }, away: { kind: "matchWinner", match: 94 } },
  { id: 99, round: "QF", home: { kind: "matchWinner", match: 91 }, away: { kind: "matchWinner", match: 92 } },
  { id: 100, round: "QF", home: { kind: "matchWinner", match: 95 }, away: { kind: "matchWinner", match: 96 } },
  // Semi-finals
  { id: 101, round: "SF", home: { kind: "matchWinner", match: 97 }, away: { kind: "matchWinner", match: 98 } },
  { id: 102, round: "SF", home: { kind: "matchWinner", match: 99 }, away: { kind: "matchWinner", match: 100 } },
  // Third-place play-off
  { id: 103, round: "TPP", home: { kind: "matchLoser", match: 101 }, away: { kind: "matchLoser", match: 102 } },
  // Final — MetLife Stadium, July 19, 2026
  { id: 104, round: "F", home: { kind: "matchWinner", match: 101 }, away: { kind: "matchWinner", match: 102 } },
];

export const MATCHES_BY_ID: Record<MatchId, MatchDef> = Object.fromEntries(
  MATCHES.map((m) => [m.id, m])
) as Record<MatchId, MatchDef>;

export const ROUNDS: { id: Round; label: string; matches: MatchId[] }[] = [
  { id: "R32", label: "Round of 32", matches: MATCHES.filter((m) => m.round === "R32").map((m) => m.id) },
  { id: "R16", label: "Round of 16", matches: MATCHES.filter((m) => m.round === "R16").map((m) => m.id) },
  { id: "QF", label: "Quarter-finals", matches: [97, 98, 99, 100] },
  { id: "SF", label: "Semi-finals", matches: [101, 102] },
  { id: "TPP", label: "Third place", matches: [103] },
  { id: "F", label: "Final", matches: [104] },
];

/** Slots that receive a third-placed team, in match order. */
const THIRD_SLOTS = MATCHES.filter(
  (m) => m.away.kind === "thirdPlace"
).map((m) => ({
  match: m.id,
  allowed: (m.away as Extract<SlotRef, { kind: "thirdPlace" }>).allowedGroups,
}));

/**
 * Allocate the 8 qualified third-placed groups to the 8 third-place slots.
 * FIFA published 495 fixed combinations (Annex C); this reproduces a valid
 * allocation for any combination via deterministic backtracking matching
 * (slots with the fewest options assigned first, groups tried alphabetically).
 */
export function allocateThirds(
  qualified: GroupId[]
): Record<MatchId, GroupId> | null {
  if (qualified.length !== 8) return null;
  const slots = [...THIRD_SLOTS]
    .map((s) => ({ ...s, options: s.allowed.filter((g) => qualified.includes(g)) }))
    .sort((a, b) => a.options.length - b.options.length);

  const assignment: Record<MatchId, GroupId> = {};
  const used = new Set<GroupId>();

  function backtrack(i: number): boolean {
    if (i === slots.length) return true;
    const slot = slots[i];
    for (const g of slot.options) {
      if (used.has(g)) continue;
      used.add(g);
      assignment[slot.match] = g;
      if (backtrack(i + 1)) return true;
      used.delete(g);
      delete assignment[slot.match];
    }
    return false;
  }

  return backtrack(0) ? assignment : null;
}

function slotLabel(slot: SlotRef): string {
  switch (slot.kind) {
    case "groupWinner":
      return `Winner Group ${slot.group}`;
    case "groupRunnerUp":
      return `Runner-up Group ${slot.group}`;
    case "thirdPlace":
      return `3rd — Group ${slot.allowedGroups.join("/")}`;
    case "matchWinner":
      return `Winner M${slot.match}`;
    case "matchLoser":
      return `Loser M${slot.match}`;
  }
}

/**
 * Resolve every match's participants from the current prediction state.
 * Invalid downstream picks (team no longer reachable) are ignored by the
 * UI via `winner` checks, and pruned by the store on upstream edits.
 */
export function resolveBracket(state: PredictionState): Map<MatchId, ResolvedMatch> {
  const thirdAlloc = allocateThirds(state.qualifiedThirdGroups) ?? {};
  const resolved = new Map<MatchId, ResolvedMatch>();

  const teamForSlot = (slot: SlotRef, selfId: MatchId): Team | null => {
    switch (slot.kind) {
      case "groupWinner": {
        const id = state.groupRankings[slot.group]?.[0];
        return id ? TEAMS_BY_ID[id] : null;
      }
      case "groupRunnerUp": {
        const id = state.groupRankings[slot.group]?.[1];
        return id ? TEAMS_BY_ID[id] : null;
      }
      case "thirdPlace": {
        const g = thirdAlloc[selfId];
        if (!g) return null;
        const id = state.groupRankings[g]?.[2];
        return id ? TEAMS_BY_ID[id] : null;
      }
      case "matchWinner": {
        const w = state.matchWinners[slot.match];
        return w ? TEAMS_BY_ID[w] : null;
      }
      case "matchLoser": {
        const prev = resolved.get(slot.match);
        const w = state.matchWinners[slot.match];
        if (!prev || !w || !prev.home || !prev.away) return null;
        return prev.home.id === w ? prev.away : prev.home;
      }
    }
  };

  for (const def of MATCHES) {
    const home = teamForSlot(def.home, def.id);
    const away = teamForSlot(def.away, def.id);
    const picked = state.matchWinners[def.id] ?? null;
    const valid =
      picked !== null &&
      (home?.id === picked || away?.id === picked);
    resolved.set(def.id, {
      def,
      home,
      away,
      homeLabel: home ? home.name : slotLabel(def.home),
      awayLabel: away ? away.name : slotLabel(def.away),
      winner: valid ? picked : null,
    });
  }
  return resolved;
}

/** Match ids whose picks become invalid and must be cleared, given a fresh resolution. */
export function invalidPicks(state: PredictionState): MatchId[] {
  const resolved = resolveBracket(state);
  const bad: MatchId[] = [];
  for (const [id, m] of resolved) {
    const picked = state.matchWinners[id];
    if (picked && m.winner === null) bad.push(id);
  }
  return bad;
}

export function progress(state: PredictionState): {
  pct: number;
  groupsDone: number;
  thirdsDone: boolean;
  picksDone: number;
  totalPicks: number;
} {
  const groupsDone = Object.values(state.groupRankings).filter(
    (r) => r && r.length === 4
  ).length;
  const thirdsDone = state.qualifiedThirdGroups.length === 8;
  const resolved = resolveBracket(state);
  let picksDone = 0;
  for (const m of resolved.values()) if (m.winner) picksDone++;
  const totalPicks = MATCHES.length; // 32 incl. third place
  // Weighting: groups 45%, thirds 5%, knockout picks 50%
  const pct = Math.round(
    (groupsDone / 12) * 45 + (thirdsDone ? 5 : 0) + (picksDone / totalPicks) * 50
  );
  return { pct, groupsDone, thirdsDone, picksDone, totalPicks };
}
