"use client";

import { useRef, useState, useCallback } from "react";
import clsx from "clsx";
import type { MatchId, ResolvedMatch, Round } from "@/types";
import { ROUNDS } from "@/lib/bracket";
import { useT } from "@/lib/i18n";
import { MatchCard } from "./MatchCard";

/**
 * Interactive knockout bracket.
 *
 * Mobile (default): one round at a time with a segmented round switcher —
 * optimized for one-handed use.
 * Desktop (lg+): full bracket with pan (drag) and zoom (buttons / pinch
 * via native scroll-zoom on trackpads).
 */
export function BracketView({
  resolved,
}: {
  resolved: Map<MatchId, ResolvedMatch>;
}) {
  const { t, round } = useT();
  const [activeRound, setActiveRound] = useState<Round>("R32");
  const [zoom, setZoom] = useState(0.85);
  const pan = useRef({ x: 0, y: 0, dragging: false, startX: 0, startY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Don't hijack pointer events that start on a pick button
    if ((e.target as HTMLElement).closest("button")) return;
    pan.current.dragging = true;
    pan.current.startX = e.clientX - pan.current.x;
    pan.current.startY = e.clientY - pan.current.y;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pan.current.dragging || !canvasRef.current) return;
    pan.current.x = e.clientX - pan.current.startX;
    pan.current.y = e.clientY - pan.current.startY;
    canvasRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px) scale(${zoom})`;
  }, [zoom]);

  const stopDrag = useCallback(() => {
    pan.current.dragging = false;
  }, []);

  const setZoomClamped = (z: number) => {
    const next = Math.min(1.4, Math.max(0.4, z));
    setZoom(next);
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px) scale(${next})`;
    }
  };

  const roundsToRender = ROUNDS.filter((r) => r.id !== "TPP");
  const tpp = resolved.get(103)!;

  return (
    <div>
      {/* ── Mobile: round-by-round ───────────────────────────── */}
      <div className="lg:hidden">
        <div
          role="tablist"
          aria-label={t("ko.roundsAria")}
          className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4"
        >
          {ROUNDS.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={activeRound === r.id}
              onClick={() => setActiveRound(r.id)}
              className={clsx(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                activeRound === r.id
                  ? "bg-volt text-pitch-950"
                  : "border border-white/15 text-ink-dim"
              )}
            >
              {round(r.id)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 justify-items-center gap-3 sm:grid-cols-2">
          {ROUNDS.find((r) => r.id === activeRound)!.matches.map((id) => (
            <MatchCard key={id} match={resolved.get(id)!} />
          ))}
        </div>
      </div>

      {/* ── Desktop: full bracket with pan + zoom ────────────── */}
      <div className="hidden lg:block">
        <div className="mb-3 flex items-center justify-end gap-2">
          <button onClick={() => setZoomClamped(zoom - 0.15)} className="btn-ghost px-3 py-1.5" aria-label={t("ko.zoomOut")}>−</button>
          <span className="w-12 text-center text-xs text-ink-dim">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoomClamped(zoom + 0.15)} className="btn-ghost px-3 py-1.5" aria-label={t("ko.zoomIn")}>+</button>
        </div>
        <div
          className="h-[70vh] cursor-grab overflow-hidden rounded-card border border-white/10 bg-pitch-900/40 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
        >
          <div
            ref={canvasRef}
            className="flex origin-top-left gap-10 p-8 will-change-transform"
            style={{ transform: `scale(${zoom})` }}
          >
            {roundsToRender.map((r2) => (
              <div key={r2.id} className="flex flex-col justify-around gap-4">
                <h4 className="text-center font-display text-xs uppercase tracking-widest text-ink-dim">
                  {round(r2.id)}
                </h4>
                {r2.matches.map((id) => (
                  <MatchCard key={id} match={resolved.get(id)!} />
                ))}
                {r2.id === "F" && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-center font-display text-[10px] uppercase tracking-widest text-ink-faint">
                      {round("TPP")}
                    </h4>
                    <MatchCard match={tpp} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
