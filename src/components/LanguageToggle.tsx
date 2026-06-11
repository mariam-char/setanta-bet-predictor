"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { useLanguage, type Lang } from "@/lib/i18n";

const OPTIONS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "ka", label: "ქარ" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);

  // Keep <html lang> in sync for screen readers / search engines.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div
      role="group"
      aria-label="Language / ენა"
      className={clsx(
        "inline-flex shrink-0 overflow-hidden rounded-full border border-white/15",
        className
      )}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          aria-pressed={lang === o.id}
          className={clsx(
            "px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
            lang === o.id
              ? "bg-volt text-pitch-950"
              : "text-ink-dim hover:bg-white/5 hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
