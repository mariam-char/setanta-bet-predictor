"use client";

import { motion } from "framer-motion";
import { usePredictionStore } from "@/store/predictionStore";
import { progress } from "@/lib/bracket";
import { useT } from "@/lib/i18n";
import { SetantaLogo } from "./SetantaLogo";
import { LanguageToggle } from "./LanguageToggle";

export function ProgressBar() {
  const state = usePredictionStore();
  const p = progress(state);
  const { t } = useT();

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-pitch-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <SetantaLogo size="sm" className="shrink-0" />
        <div
          role="progressbar"
          aria-valuenow={p.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("progress.aria")}
          className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"
        >
          <motion.div
            className="h-full rounded-full bg-volt shadow-voltGlow"
            initial={false}
            animate={{ width: `${p.pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <span className="w-12 text-right font-display text-sm text-volt">
          {p.pct}%
        </span>
        <LanguageToggle />
      </div>
    </div>
  );
}
