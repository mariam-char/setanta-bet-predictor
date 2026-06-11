"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { Team } from "@/types";
import { useT } from "@/lib/i18n";

const STORAGE_KEY = "wc26-promo-entry-v1";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

function isValidContact(value: string): boolean {
  const v = value.trim();
  return EMAIL_RE.test(v) || (PHONE_RE.test(v) && v.replace(/\D/g, "").length >= 7);
}

interface Props {
  /** The two teams the user predicted to reach the final. */
  finalists: [Team, Team];
}

type Status = "idle" | "submitting" | "done";

export function FinalistPromoForm({ finalists }: Props) {
  const { t, tn } = useT();
  const [contact, setContact] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Already entered on this device? Show the confirmation straight away.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setStatus("done");
    } catch {
      /* ignore */
    }
  }, []);

  const contactValid = isValidContact(contact);
  const canSubmit = contactValid && status !== "submitting";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finalistTeamIds: [finalists[0].id, finalists[1].id],
          contact: contact.trim(),
        }),
      });
      if (res.status === 201 || res.status === 409) {
        // 409 = this contact already entered — treat as done so users
        // who re-submit on another device still see the confirmation.
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ finalists: [finalists[0].id, finalists[1].id], at: new Date().toISOString() })
        );
        setStatus("done");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(typeof body?.error === "string" ? body.error : t("promo.errGeneric"));
      setStatus("idle");
    } catch {
      setError(t("promo.errNetwork"));
      setStatus("idle");
    }
  };

  return (
    <section
      aria-label={t("promo.aria")}
      className="glass relative mt-12 w-full max-w-lg overflow-hidden p-6 text-left"
    >
      {/* Promo glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-volt/20 blur-3xl"
      />

      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-4xl" aria-hidden>🎰</p>
            <h2 className="heading-hero mt-3 text-2xl text-volt">{t("promo.done.title")}</h2>
            <p className="mt-2 text-sm text-ink-dim">
              {t("promo.done.backed", {
                t1: `${finalists[0].flag} ${tn(finalists[0])}`,
                t2: `${finalists[1].flag} ${tn(finalists[1])}`,
              })}
            </p>
            <p className="mt-3 text-sm text-ink-dim">{t("promo.done.sub")}</p>
            <p className="mt-4 text-[11px] text-ink-faint">{t("promo.done.smallPrint")}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-volt">
              {t("promo.kicker")}
            </p>
            <h2 className="heading-hero mt-2 text-2xl">{t("promo.title")}</h2>
            <p className="mt-2 text-sm text-ink-dim">{t("promo.sub")}</p>

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-ink-faint">
                {t("promo.yourFinalists")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {finalists.map((team) => (
                  <div
                    key={team.id}
                    className="glass flex flex-col items-center gap-1 border-volt/40 bg-volt/5 px-3 py-4"
                  >
                    <span className="text-3xl" aria-hidden>{team.flag}</span>
                    <span className="font-display text-sm uppercase">{team.shortName}</span>
                    <span className="text-[11px] text-ink-dim">{tn(team)}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="text-xs uppercase tracking-wider text-ink-faint">
                {t("promo.contactLabel")}
              </span>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={t("promo.placeholder")}
                aria-invalid={touched && !contactValid}
                aria-describedby="promo-contact-hint"
                className={clsx(
                  "mt-1.5 w-full rounded-chip border bg-white/[0.04] px-4 py-3 text-sm",
                  "placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-volt/60",
                  touched && !contactValid && contact.length > 0
                    ? "border-danger/60"
                    : "border-white/15"
                )}
              />
              <span id="promo-contact-hint" className="mt-1 block text-[11px] text-ink-faint">
                {touched && !contactValid && contact.length > 0
                  ? t("promo.hintInvalid")
                  : t("promo.hint")}
              </span>
            </label>

            {error && (
              <p role="alert" className="mt-3 text-xs text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "submitting" ? t("promo.submitting") : t("promo.submit")}
            </button>

            <p className="mt-3 text-center text-[11px] text-ink-faint">
              {t("promo.smallPrint")}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
