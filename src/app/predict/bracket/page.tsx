"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePredictionStore } from "@/store/predictionStore";
import { resolveBracket, progress } from "@/lib/bracket";
import { BracketView } from "@/components/BracketView";
import { useT } from "@/lib/i18n";
import clsx from "clsx";

export default function BracketPage() {
  const state = usePredictionStore();
  const { t } = useT();

  const resolved = useMemo(
    () => resolveBracket(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.groupRankings, state.qualifiedThirdGroups, state.matchWinners]
  );

  const p = progress(state);
  const finalDone = !!resolved.get(104)?.winner && !!resolved.get(103)?.winner;
  const ready = p.groupsDone === 12 && p.thirdsDone;

  if (!ready) {
    return (
      <div className="glass mx-auto mt-12 max-w-md p-6 text-center">
        <h1 className="font-display text-xl uppercase">{t("locked.title")}</h1>
        <p className="mt-2 text-sm text-ink-dim">{t("locked.sub")}</p>
        <Link href="/predict/summary" className="btn-primary mt-5">
          {t("locked.back")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-hero text-3xl sm:text-4xl">
            {t("ko.title")}<span className="text-volt">.</span>
          </h1>
          <p className="mt-2 text-sm text-ink-dim">
            {t("ko.sub", { done: p.picksDone, total: p.totalPicks })}
          </p>
        </div>
        <Link href="/predict/summary" className="btn-ghost">{t("ko.editQualifiers")}</Link>
      </header>

      <BracketView resolved={resolved} />

      <div className="mt-8 flex justify-center">
        <Link
          href="/predict/champion"
          aria-disabled={!finalDone}
          onClick={(e) => !finalDone && e.preventDefault()}
          className={clsx("btn-primary text-base", !finalDone && "opacity-40")}
        >
          {finalDone ? t("ko.reveal") : t("ko.revealLocked")}
        </Link>
      </div>
    </div>
  );
}
