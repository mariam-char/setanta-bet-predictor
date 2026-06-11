"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import { GROUP_IDS, TEAMS_BY_ID } from "@/lib/teams";
import { usePredictionStore } from "@/store/predictionStore";
import { TeamChip } from "@/components/TeamChip";
import { useT } from "@/lib/i18n";

export default function SummaryPage() {
  const { t, tn } = useT();
  const groupRankings = usePredictionStore((s) => s.groupRankings);
  const qualifiedThirdGroups = usePredictionStore((s) => s.qualifiedThirdGroups);
  const toggleThirdGroup = usePredictionStore((s) => s.toggleThirdGroup);
  const syncRemote = usePredictionStore((s) => s.syncRemote);

  const groupsDone = GROUP_IDS.every((g) => groupRankings[g]?.length === 4);
  const thirdsDone = qualifiedThirdGroups.length === 8;

  return (
    <div>
      <header className="mb-6">
        <h1 className="heading-hero text-3xl sm:text-4xl">
          {t("summary.title")}<span className="text-volt">?</span>
        </h1>
        <p className="mt-2 text-sm text-ink-dim">
          {t("summary.sub1")}
          <strong className="text-volt">{t("summary.sub2")}</strong>
          {t("summary.sub3")}
        </p>
      </header>

      {!groupsDone && (
        <div className="glass mb-6 border-danger/40 p-4 text-sm">
          {t("summary.warn")}{" "}
          <Link href="/predict/groups" className="font-bold text-volt underline">
            {t("summary.warnLink")}
          </Link>{" "}
          {t("summary.warnEnd")}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GROUP_IDS.map((g, i) => {
          const r = groupRankings[g];
          if (!r) return null;
          const third = TEAMS_BY_ID[r[2]];
          const selected = qualifiedThirdGroups.includes(g);
          return (
            <motion.section
              key={g}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass p-3"
              aria-label={t("summary.qualAria", { group: g })}
            >
              <h3 className="mb-2 font-display text-xs uppercase text-ink-dim">
                {t("group")} <span className="text-volt">{g}</span>
              </h3>
              <ul className="space-y-1.5">
                <li className="rounded-lg bg-volt/10 px-2 py-1.5">
                  <TeamChip team={TEAMS_BY_ID[r[0]]} size="sm" />
                </li>
                <li className="rounded-lg bg-broadcast/10 px-2 py-1.5">
                  <TeamChip team={TEAMS_BY_ID[r[1]]} size="sm" />
                </li>
              </ul>
              <button
                type="button"
                onClick={() => toggleThirdGroup(g)}
                aria-pressed={selected}
                aria-label={t(selected ? "summary.removeAria" : "summary.advanceAria", { team: tn(third) })}
                className={clsx(
                  "mt-1.5 flex w-full items-center justify-between rounded-lg border px-2 py-1.5 transition-colors",
                  selected
                    ? "border-white/60 bg-white/10"
                    : "border-dashed border-white/15 opacity-70 hover:opacity-100"
                )}
              >
                <TeamChip team={third} size="sm" muted={!selected} />
                <span
                  className={clsx(
                    "text-[10px] font-bold uppercase",
                    selected ? "text-ink" : "text-ink-faint"
                  )}
                >
                  {selected ? t("third.in") : t("third.q")}
                </span>
              </button>
            </motion.section>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p
          className="glass px-4 py-2 text-sm"
          role="status"
          aria-live="polite"
        >
          {t("wildcards")}{" "}
          <span className={clsx("font-display", thirdsDone ? "text-volt" : "text-broadcast")}>
            {qualifiedThirdGroups.length}/8
          </span>
        </p>
        <div className="flex gap-3">
          <Link href="/predict/groups" className="btn-ghost bg-pitch-950 hover:bg-pitch-950/90">
            {t("editGroups")}
          </Link>
          <Link
            href="/predict/bracket"
            aria-disabled={!groupsDone || !thirdsDone}
            onClick={(e) => {
              if (!groupsDone || !thirdsDone) e.preventDefault();
              else void syncRemote();
            }}
            className={clsx(
              "btn-primary",
              (!groupsDone || !thirdsDone) && "pointer-events-auto opacity-40"
            )}
          >
            {t("generate")}
          </Link>
        </div>
      </div>
    </div>
  );
}
