"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePredictionStore } from "@/store/predictionStore";
import { resolveBracket } from "@/lib/bracket";
import { TEAMS_BY_ID } from "@/lib/teams";
import { confidenceScore } from "@/lib/confidence";
import { FinalistPromoForm } from "@/components/FinalistPromoForm";
import { useT } from "@/lib/i18n";
import type { Team } from "@/types";

export default function ChampionPage() {
  const state = usePredictionStore();
  const syncRemote = usePredictionStore((s) => s.syncRemote);
  const { t, tn, conf: confLabel } = useT();

  const { champion, runnerUp, third, finalists } = useMemo(() => {
    const resolved = resolveBracket(state);
    const final = resolved.get(104);
    const tpp = resolved.get(103);
    const championId = final?.winner ?? null;
    const champion = championId ? TEAMS_BY_ID[championId] : null;
    const runnerUp =
      final && championId && final.home && final.away
        ? final.home.id === championId
          ? final.away
          : final.home
        : null;
    const third = tpp?.winner ? TEAMS_BY_ID[tpp.winner] : null;
    const finalists: [Team, Team] | null =
      final && final.home && final.away ? [final.home, final.away] : null;
    return { champion, runnerUp, third, finalists };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.groupRankings, state.qualifiedThirdGroups, state.matchWinners]);

  const conf = confidenceScore(state);

  if (!champion) {
    return (
      <div className="glass mx-auto mt-12 max-w-md p-6 text-center">
        <h1 className="font-display text-xl uppercase">{t("noChamp.title")}</h1>
        <p className="mt-2 text-sm text-ink-dim">{t("noChamp.sub")}</p>
        <Link href="/predict/bracket" className="btn-primary mt-5">
          {t("noChamp.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden text-center">
      {/* Celebration burst */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-sm"
            style={{
              left: `${(i * 41) % 100}%`,
              top: "-2%",
              backgroundColor: i % 3 === 0 ? "#FFD200" : i % 3 === 1 ? "#FA5C5C" : "#FFFFFF",
            }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: "105vh", opacity: [0, 1, 1, 0.6], rotate: 360 + i * 30 }}
            transition={{
              duration: 3.2 + (i % 5) * 0.5,
              delay: 0.6 + (i % 7) * 0.18,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-xs uppercase tracking-[0.35em] text-ink-dim"
      >
        {t("champ.kicker")}
      </motion.p>

      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.25 }}
        className="mt-6 text-8xl drop-shadow-[0_0_60px_rgba(255,200,61,0.55)]"
        aria-hidden
      >
        🏆
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="heading-hero mt-4 text-5xl sm:text-7xl"
      >
        <span aria-hidden className="mr-3">{champion.flag}</span>
        {tn(champion)}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"
      >
        {runnerUp && (
          <span className="glass px-4 py-2">
            🥈 {t("champ.runnerUp")} <strong>{runnerUp.flag} {tn(runnerUp)}</strong>
          </span>
        )}
        {third && (
          <span className="glass px-4 py-2">
            🥉 {t("champ.third")} <strong>{third.flag} {tn(third)}</strong>
          </span>
        )}
        <span className="glass px-4 py-2">
          🎯 {t("champ.confidence")} <strong className="text-volt">{conf.score}</strong> — {confLabel(conf.label)}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-10 flex gap-3"
      >
        <Link href="/predict/bracket" className="btn-ghost">{t("champ.editBracket")}</Link>
        <Link
          href="/dashboard"
          className="btn-primary"
          onClick={() => void syncRemote()}
        >
          {t("champ.seeFull")}
        </Link>
      </motion.div>

      {/* Setanta Bet finalist promo */}
      {finalists && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="z-10 flex w-full justify-center px-4 pb-8"
        >
          <FinalistPromoForm finalists={finalists} />
        </motion.div>
      )}
    </div>
  );
}
