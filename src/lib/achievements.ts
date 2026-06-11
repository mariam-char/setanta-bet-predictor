import type { Achievement, PredictionState } from "@/types";
import { progress } from "./bracket";
import { confidenceScore } from "./confidence";

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-group", title: "Opening Whistle", description: "Rank your first group", icon: "🎽" },
  { id: "all-groups", title: "Group Guru", description: "Rank all 12 groups", icon: "🗂️" },
  { id: "thirds-picked", title: "Wildcard Wrangler", description: "Choose your 8 best third-placed teams", icon: "🃏" },
  { id: "r32-done", title: "Knockout Artist", description: "Complete the Round of 32", icon: "🥊" },
  { id: "r16-done", title: "Sweet Sixteen", description: "Complete the Round of 16", icon: "🍬" },
  { id: "qf-done", title: "Elite Eight", description: "Complete the Quarter-finals", icon: "⚡" },
  { id: "sf-done", title: "Final Four", description: "Complete the Semi-finals", icon: "🔥" },
  { id: "champion", title: "Crystal Ball", description: "Crown your champion", icon: "🏆" },
  { id: "chaos", title: "Agent of Chaos", description: "Finish with confidence below 40", icon: "🌪️" },
  { id: "chalk", title: "Chalk Master", description: "Finish with confidence above 80", icon: "📋" },
];

const BY_ROUND: Record<string, [number, number]> = {
  "r32-done": [73, 88],
  "r16-done": [89, 96],
  "qf-done": [97, 100],
  "sf-done": [101, 102],
};

/** Returns ids of achievements earned by the current state. */
export function earnedAchievements(state: PredictionState): string[] {
  const earned: string[] = [];
  const p = progress(state);

  if (p.groupsDone >= 1) earned.push("first-group");
  if (p.groupsDone === 12) earned.push("all-groups");
  if (p.thirdsDone) earned.push("thirds-picked");

  for (const [id, [lo, hi]] of Object.entries(BY_ROUND)) {
    let done = true;
    for (let m = lo; m <= hi; m++) {
      if (!state.matchWinners[m]) { done = false; break; }
    }
    if (done) earned.push(id);
  }

  if (state.matchWinners[104]) {
    earned.push("champion");
    const c = confidenceScore(state);
    if (c.score < 40) earned.push("chaos");
    if (c.score > 80) earned.push("chalk");
  }
  return earned;
}
