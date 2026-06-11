"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SetantaLogo } from "@/components/SetantaLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

export default function WelcomePage() {
  const { t } = useT();

  const steps = [
    ["01", t("step1.title"), t("step1.copy")],
    ["02", t("step2.title"), t("step2.copy")],
    ["03", t("step3.title"), t("step3.copy")],
  ];

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Stadium light beams */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-pitch-lines opacity-40" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[140%] -translate-x-1/2 rounded-[100%] bg-broadcast/10 blur-3xl" />

      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <SetantaLogo size="lg" />
        </motion.div>

        <motion.p
          variants={item}
          className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-volt"
        >
          {t("hero.kicker")}
        </motion.p>

        <motion.h1
          variants={item}
          className="heading-hero text-5xl sm:text-7xl"
        >
          {t("hero.title1")}
          <br />
          <span className="text-volt drop-shadow-[0_0_30px_rgba(255,210,0,0.45)]">
            {t("hero.title2")}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-base text-ink-dim sm:text-lg"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <Link href="/predict/groups" className="btn-primary text-base">
            {t("hero.cta")}
          </Link>
          <p className="mt-3 text-xs text-ink-faint">{t("hero.meta")}</p>
        </motion.div>

        <motion.ol
          variants={item}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3"
          aria-label={t("how.aria")}
        >
          {steps.map(([n, title, copy]) => (
            <li key={n} className="glass p-4">
              <span className="font-display text-volt">{n}</span>
              <h2 className="mt-1 font-display text-sm uppercase">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-dim">{copy}</p>
            </li>
          ))}
        </motion.ol>
      </motion.div>
    </div>
  );
}
