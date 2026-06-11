"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { GROUP_IDS } from "@/lib/teams";
import { usePredictionStore } from "@/store/predictionStore";
import { GroupCard } from "@/components/GroupCard";
import { useT } from "@/lib/i18n";

export default function GroupsPage() {
  const [page, setPage] = useState(0); // mobile: 2 groups per page
  const groupRankings = usePredictionStore((s) => s.groupRankings);
  const syncRemote = usePredictionStore((s) => s.syncRemote);
  const { t } = useT();

  const done = GROUP_IDS.filter((g) => groupRankings[g]?.length === 4).length;
  const pages = 6;
  const visible = GROUP_IDS.slice(page * 2, page * 2 + 2);

  return (
    <div>
      <header className="mb-6">
        <h1 className="heading-hero text-3xl sm:text-4xl">
          {t("groups.title")}<span className="text-volt">.</span>
        </h1>
        <p className="mt-2 text-sm text-ink-dim">{t("groups.sub")}</p>
      </header>

      {/* Mobile: paged, 2 groups at a time */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {visible.map((g) => (
              <GroupCard key={g} group={g} />
            ))}
          </motion.div>
        </AnimatePresence>

        <nav
          aria-label={t("groups.pagesAria")}
          className="mt-6 flex items-center justify-between"
        >
          <button
            className="btn-ghost"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            {t("nav.back")}
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: pages }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1.5 w-5 rounded-full transition-colors",
                  i === page ? "bg-volt" : "bg-white/15"
                )}
              />
            ))}
          </div>
          {page < pages - 1 ? (
            <button className="btn-ghost" onClick={() => setPage((p) => p + 1)}>
              {t("nav.next")}
            </button>
          ) : (
            <Link
              href="/predict/summary"
              className="btn-primary"
              onClick={() => void syncRemote()}
            >
              {t("nav.review")}
            </Link>
          )}
        </nav>
      </div>

      {/* Desktop: full grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {GROUP_IDS.map((g) => (
            <GroupCard key={g} group={g} />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-ink-dim">
            {t("groups.ranked", { done })}
          </p>
          <Link
            href="/predict/summary"
            className="btn-primary"
            onClick={() => void syncRemote()}
          >
            {t("nav.reviewQual")}
          </Link>
        </div>
      </div>
    </div>
  );
}
