"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GroupId, MatchId, PredictionState, TeamId } from "@/types";
import { invalidPicks } from "@/lib/bracket";
import { earnedAchievements } from "@/lib/achievements";
import { teamsInGroup } from "@/lib/teams";

interface PredictionActions {
  /** Set the full 1st→4th order for a group (drag-and-drop result). */
  setGroupRanking: (group: GroupId, ordered: TeamId[]) => void;
  toggleThirdGroup: (group: GroupId) => void;
  pickWinner: (match: MatchId, team: TeamId) => void;
  /** Seed a group with its default (seed-ranked) order if untouched. */
  ensureGroupDefault: (group: GroupId) => void;
  reset: () => void;
  /** Sync to backend (fire-and-forget autosave). */
  syncRemote: () => Promise<void>;
}

const initial: PredictionState = {
  groupRankings: {},
  qualifiedThirdGroups: [],
  matchWinners: {},
  achievements: [],
  updatedAt: null,
};

export const usePredictionStore = create<PredictionState & PredictionActions>()(
  persist(
    (set, get) => ({
      ...initial,

      setGroupRanking: (group, ordered) =>
        set((s) => {
          const next: PredictionState = {
            ...s,
            groupRankings: { ...s.groupRankings, [group]: ordered },
            updatedAt: new Date().toISOString(),
          };
          // Editing standings can invalidate downstream knockout picks.
          const winners = { ...next.matchWinners };
          for (const id of invalidPicks(next)) delete winners[id];
          next.matchWinners = winners;
          next.achievements = mergeAchievements(s.achievements, next);
          return next;
        }),

      toggleThirdGroup: (group) =>
        set((s) => {
          const has = s.qualifiedThirdGroups.includes(group);
          if (!has && s.qualifiedThirdGroups.length >= 8) return s; // hard cap
          const qualifiedThirdGroups = has
            ? s.qualifiedThirdGroups.filter((g) => g !== group)
            : [...s.qualifiedThirdGroups, group];
          const next: PredictionState = {
            ...s,
            qualifiedThirdGroups,
            updatedAt: new Date().toISOString(),
          };
          const winners = { ...next.matchWinners };
          for (const id of invalidPicks(next)) delete winners[id];
          next.matchWinners = winners;
          next.achievements = mergeAchievements(s.achievements, next);
          return next;
        }),

      pickWinner: (match, team) =>
        set((s) => {
          const next: PredictionState = {
            ...s,
            matchWinners: { ...s.matchWinners, [match]: team },
            updatedAt: new Date().toISOString(),
          };
          const winners = { ...next.matchWinners };
          for (const id of invalidPicks(next)) delete winners[id];
          next.matchWinners = winners;
          next.achievements = mergeAchievements(s.achievements, next);
          return next;
        }),

      ensureGroupDefault: (group) =>
        set((s) => {
          if (s.groupRankings[group]?.length === 4) return s;
          const ordered = teamsInGroup(group)
            .slice()
            .sort((a, b) => a.seed - b.seed)
            .map((t) => t.id);
          return {
            ...s,
            groupRankings: { ...s.groupRankings, [group]: ordered },
          };
        }),

      reset: () => set({ ...initial }),

      syncRemote: async () => {
        const s = get();
        try {
          await fetch("/api/predictions", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              groupRankings: s.groupRankings,
              qualifiedThirdGroups: s.qualifiedThirdGroups,
              matchWinners: s.matchWinners,
            }),
          });
        } catch {
          // Offline-first: local persistence is the source of truth;
          // remote sync retries on next action.
        }
      },
    }),
    { name: "wc26-prediction-v1" }
  )
);

/** Achievements are sticky — once unlocked they stay unlocked. */
function mergeAchievements(prev: string[], state: PredictionState): string[] {
  const now = earnedAchievements(state);
  return Array.from(new Set([...prev, ...now]));
}

/** Newly unlocked achievement ids between two snapshots (for toasts). */
export function newlyUnlocked(prev: string[], next: string[]): string[] {
  return next.filter((id) => !prev.includes(id));
}
