import type { ConfidenceBreakdown, PredictionState } from "@/types";
import { resolveBracket } from "./bracket";

/**
 * Confidence score: how closely the prediction tracks seeding.
 * 100 = pure chalk, 0 = full chaos. Both extremes earn badges.
 */
export function confidenceScore(state: PredictionState): ConfidenceBreakdown {
  const resolved = resolveBracket(state);
  let favorites = 0;
  let upsets = 0;

  for (const m of resolved.values()) {
    if (!m.winner || !m.home || !m.away) continue;
    const winner = m.winner === m.home.id ? m.home : m.away;
    const loser = m.winner === m.home.id ? m.away : m.home;
    if (winner.seed <= loser.seed) favorites++;
    else upsets++;
  }

  const total = favorites + upsets;
  const score = total === 0 ? 50 : Math.round((favorites / total) * 100);
  const label =
    total === 0
      ? "No picks yet"
      : score >= 80
        ? "Chalk Master"
        : score >= 60
          ? "Calculated Risk"
          : score >= 40
            ? "Bold Caller"
            : "Agent of Chaos";

  return { score, totalPicks: total, favoritesPicked: favorites, upsetsPicked: upsets, label };
}
