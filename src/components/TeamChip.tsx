"use client";

import clsx from "clsx";
import type { Team } from "@/types";
import { useT } from "@/lib/i18n";

export function TeamChip({
  team,
  size = "md",
  muted = false,
}: {
  team: Team;
  size?: "sm" | "md" | "lg";
  muted?: boolean;
}) {
  const { tn } = useT();
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 min-w-0",
        muted && "opacity-50"
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "shrink-0 leading-none",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl"
        )}
      >
        {team.flag}
      </span>
      <span
        className={clsx(
          "truncate font-semibold",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-lg"
        )}
      >
        {tn(team)}
      </span>
    </span>
  );
}
