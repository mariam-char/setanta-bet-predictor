import clsx from "clsx";

/**
 * Setanta Bet wordmark, recreated in CSS so it scales crisply at any size
 * and needs no image asset: yellow block "SETANTA" with a slashed right
 * edge, black gap, red parallelogram "bet". Swap for the official SVG by
 * replacing this component's internals — the API stays the same.
 */
export function SetantaLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const text =
    size === "sm" ? "text-[11px]" : size === "md" ? "text-sm" : "text-2xl";
  const padY =
    size === "sm" ? "py-1" : size === "md" ? "py-1.5" : "py-3";
  const slash = size === "lg" ? 14 : 8;

  return (
    <span
      role="img"
      aria-label="Setanta Bet"
      className={clsx(
        "inline-flex select-none items-stretch font-display uppercase leading-none",
        text,
        className
      )}
    >
      <span
        className={clsx("bg-[#FFD200] pl-2.5 text-[#0D0D0D] tracking-tight", padY)}
        style={{
          paddingRight: slash + 6,
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${slash}px) 100%, 0 100%)`,
        }}
      >
        Setanta
      </span>
      <span
        className={clsx("-ml-1 bg-[#FA5C5C] px-2.5 text-[#0D0D0D]", padY)}
        style={{ transform: `skewX(-${size === "lg" ? 14 : 12}deg)` }}
      >
        <span
          className="inline-block lowercase"
          style={{ transform: `skewX(${size === "lg" ? 14 : 12}deg)` }}
        >
          bet
        </span>
      </span>
    </span>
  );
}
