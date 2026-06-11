"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePredictionStore } from "@/store/predictionStore";
import { resolveBracket, progress } from "@/lib/bracket";
import { confidenceScore } from "@/lib/confidence";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { GROUP_IDS, TEAMS_BY_ID } from "@/lib/teams";
import { BracketView } from "@/components/BracketView";
import { TeamChip } from "@/components/TeamChip";
import { SetantaLogo } from "@/components/SetantaLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";
import clsx from "clsx";

export default function DashboardPage() {
  const state = usePredictionStore();
  const reset = usePredictionStore((s) => s.reset);
  const syncRemote = usePredictionStore((s) => s.syncRemote);
  const [copied, setCopied] = useState(false);
  const { t, tn, ach, conf: confLabel } = useT();

  const resolved = useMemo(
    () => resolveBracket(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.groupRankings, state.qualifiedThirdGroups, state.matchWinners]
  );

  const p = progress(state);
  const conf = confidenceScore(state);
  const final = resolved.get(104);
  const champion = final?.winner ? TEAMS_BY_ID[final.winner] : null;
  const finalists = final && final.home && final.away ? [final.home, final.away] : [];
  const semis = [101, 102]
    .flatMap((id) => {
      const m = resolved.get(id);
      return m && m.home && m.away ? [m.home, m.away] : [];
    });

  const share = async () => {
    const text = champion
      ? t("share.champion", {
          flag: champion.flag,
          team: tn(champion),
          final: finalists.map((f) => `${f.flag} ${f.shortName}`).join(" v "),
          score: conf.score,
          label: confLabel(conf.label),
        })
      : t("share.wip", { pct: p.pct });
    try {
      if (navigator.share) {
        await navigator.share({ text, title: t("share.title") });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user dismissed share sheet */
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3"><SetantaLogo size="sm" /></div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-dim">
            {t("dash.kicker")}
          </p>
          <h1 className="heading-hero mt-1 text-4xl">
            {champion ? (
              <>
                <span aria-hidden>{champion.flag}</span>{" "}
                {t("dash.winItAll", { team: tn(champion) })}
              </>
            ) : (
              <>{t("dash.wip", { pct: p.pct })}</>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={share} className="btn-primary">
            {copied ? t("dash.copied") : t("dash.share")}
          </button>
          <Link href="/predict/groups" className="btn-ghost">{t("dash.edit")}</Link>
          <button
            onClick={() => { void syncRemote(); }}
            className="btn-ghost"
          >
            {t("dash.save")}
          </button>
          <LanguageToggle />
        </div>
      </header>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="glass p-4">
          <p className="text-xs uppercase tracking-wider text-ink-faint">{t("stat.champion")}</p>
          <p className="mt-1 truncate font-display text-lg">
            {champion ? `${champion.flag} ${tn(champion)}` : "—"}
          </p>
        </div>
        <div className="glass p-4">
          <p className="text-xs uppercase tracking-wider text-ink-faint">{t("stat.finalists")}</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {finalists.length === 2
              ? finalists.map((t) => `${t.flag} ${t.shortName}`).join(" v ")
              : "—"}
          </p>
        </div>
        <div className="glass p-4">
          <p className="text-xs uppercase tracking-wider text-ink-faint">{t("stat.semis")}</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {semis.length === 4 ? semis.map((t) => t.flag).join(" ") : "—"}
          </p>
        </div>
        <div className="glass p-4">
          <p className="text-xs uppercase tracking-wider text-ink-faint">{t("stat.confidence")}</p>
          <p className="mt-1 font-display text-lg text-volt">
            {conf.score} <span className="text-xs text-ink-dim">{confLabel(conf.label)}</span>
          </p>
        </div>
      </div>

      {/* Achievements */}
      <section aria-label={t("dash.badgesAria")} className="mb-10">
        <h2 className="mb-3 font-display text-sm uppercase tracking-widest text-ink-dim">
          {t("dash.badges")}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = state.achievements.includes(a.id);
            const loc = ach(a.id, a.title, a.description);
            return (
              <li
                key={a.id}
                title={loc.description}
                className={clsx(
                  "glass flex items-center gap-2 px-3 py-2 text-xs",
                  !unlocked && "opacity-30 grayscale"
                )}
              >
                <span aria-hidden>{a.icon}</span>
                <span className="font-semibold">{loc.title}</span>
                <span className="sr-only">
                  {unlocked ? t("dash.unlocked") : t("dash.locked")} {loc.description}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Full bracket */}
      <section aria-label={t("dash.overview")} className="mb-10">
        <h2 className="mb-3 font-display text-sm uppercase tracking-widest text-ink-dim">
          {t("dash.overview")}
        </h2>
        <BracketView resolved={resolved} />
      </section>

      {/* Group rankings recap */}
      <section aria-label={t("dash.groupRankings")}>
        <h2 className="mb-3 font-display text-sm uppercase tracking-widest text-ink-dim">
          {t("dash.groupRankings")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GROUP_IDS.map((g) => {
            const r = state.groupRankings[g];
            if (!r) return null;
            return (
              <div key={g} className="glass p-3">
                <h3 className="mb-2 font-display text-xs uppercase text-volt">
                  {t("group")} {g}
                </h3>
                <ol className="space-y-1">
                  {r.map((id, i) => (
                    <li key={id} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-ink-faint">{i + 1}.</span>
                      <TeamChip team={TEAMS_BY_ID[id]} size="sm" muted={i === 3} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-12 text-center">
        <button
          onClick={() => {
            if (confirm(t("dash.resetConfirm"))) reset();
          }}
          className="text-xs text-ink-faint underline hover:text-danger"
        >
          {t("dash.reset")}
        </button>
      </div>
    </div>
  );
}
