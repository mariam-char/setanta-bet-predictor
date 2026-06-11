"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { ResolvedMatch, Team } from "@/types";
import { usePredictionStore } from "@/store/predictionStore";
import { useT } from "@/lib/i18n";

function Side({
  team,
  label,
  picked,
  eliminated,
  onPick,
}: {
  team: Team | null;
  label: string;
  picked: boolean;
  eliminated: boolean;
  onPick: () => void;
}) {
  const { t, tn, slot } = useT();
  return (
    <button
      type="button"
      disabled={!team}
      onClick={onPick}
      aria-pressed={picked}
      aria-label={
        team
          ? t(picked ? "match.picked" : "match.pick", { team: tn(team) })
          : t("match.awaiting", { label: slot(label) })
      }
      className={clsx(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
        picked && "bg-volt/15 ring-1 ring-volt/70",
        !picked && team && "hover:bg-white/5",
        !team && "cursor-default opacity-50",
        eliminated && "opacity-40"
      )}
    >
      <span aria-hidden className="text-lg leading-none">
        {team ? team.flag : "·"}
      </span>
      <span
        className={clsx(
          "min-w-0 flex-1 truncate text-sm",
          picked ? "font-bold text-volt" : "font-medium",
          !team && "text-xs text-ink-faint"
        )}
      >
        {team ? tn(team) : slot(label)}
      </span>
      {picked && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-volt"
          aria-hidden
        >
          ✓
        </motion.span>
      )}
    </button>
  );
}

export function MatchCard({ match }: { match: ResolvedMatch }) {
  const pickWinner = usePredictionStore((s) => s.pickWinner);
  const { t } = useT();
  const { def, home, away, winner } = match;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-hover w-60 p-2"
      aria-label={t("match.aria", { id: def.id })}
    >
      <p className="px-2.5 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
        M{def.id}
      </p>
      <div className="space-y-1">
        <Side
          team={home}
          label={match.homeLabel}
          picked={!!home && winner === home.id}
          eliminated={!!winner && !!home && winner !== home.id}
          onPick={() => home && pickWinner(def.id, home.id)}
        />
        <div className="mx-2.5 border-t border-white/5" role="separator" />
        <Side
          team={away}
          label={match.awayLabel}
          picked={!!away && winner === away.id}
          eliminated={!!winner && !!away && winner !== away.id}
          onPick={() => away && pickWinner(def.id, away.id)}
        />
      </div>
    </motion.article>
  );
}
