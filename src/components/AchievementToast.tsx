"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePredictionStore } from "@/store/predictionStore";
import { ACHIEVEMENTS } from "@/lib/achievements";

/**
 * Watches the achievements list and toasts newly unlocked badges.
 * Mount once inside the predict layout.
 */
export function AchievementToast() {
  const achievements = usePredictionStore((s) => s.achievements);
  const seen = useRef<string[]>(achievements);
  const [queue, setQueue] = useState<string[]>([]);

  useEffect(() => {
    const fresh = achievements.filter((a) => !seen.current.includes(a));
    if (fresh.length) {
      seen.current = achievements;
      setQueue((q) => [...q, ...fresh]);
    }
  }, [achievements]);

  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 2800);
    return () => clearTimeout(t);
  }, [queue]);

  const current = queue[0]
    ? ACHIEVEMENTS.find((a) => a.id === queue[0])
    : null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass flex items-center gap-3 px-5 py-3"
          >
            <span className="text-2xl" aria-hidden>{current.icon}</span>
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-volt">
                {current.title}
              </p>
              <p className="text-xs text-ink-dim">{current.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
