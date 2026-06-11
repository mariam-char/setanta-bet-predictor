"use client";

import { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import type { GroupId } from "@/types";
import { TEAMS_BY_ID } from "@/lib/teams";
import { usePredictionStore } from "@/store/predictionStore";
import { useT } from "@/lib/i18n";
import { TeamChip } from "./TeamChip";

const POSITION_STYLE = [
  "border-volt/60 bg-volt/10", // 1st — qualifies
  "border-broadcast/60 bg-broadcast/10", // 2nd — qualifies
  "border-white/25 bg-white/[0.06]", // 3rd — possible wildcard
  "border-white/10 bg-white/[0.03] opacity-80", // 4th — out
];

const POSITION_KEYS = ["pos.1", "pos.2", "pos.3", "pos.4"] as const;

function SortableRow({
  teamId,
  index,
  group,
  onMove,
}: {
  teamId: string;
  index: number;
  group: GroupId;
  onMove: (from: number, to: number) => void;
}) {
  const team = TEAMS_BY_ID[teamId];
  const { t, tn } = useT();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: teamId });
  const pos = t(POSITION_KEYS[index]);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        "flex items-center gap-3 rounded-chip border px-3 py-2.5 touch-none select-none",
        POSITION_STYLE[index],
        isDragging && "z-10 shadow-lift"
      )}
    >
      <span
        className={clsx(
          "w-8 shrink-0 font-display text-xs uppercase",
          index === 0 ? "text-volt" : index === 1 ? "text-broadcast" : index === 2 ? "text-ink-dim" : "text-ink-faint"
        )}
      >
        {pos}
      </span>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={t("card.reorderAria", { team: tn(team), pos, group })}
        className="flex min-w-0 flex-1 cursor-grab items-center justify-between gap-2 text-left active:cursor-grabbing"
      >
        <TeamChip team={team} />
        <span aria-hidden className="text-ink-faint">⠿</span>
      </button>
      {/* One-handed / assistive fallback: explicit move buttons */}
      <span className="flex shrink-0 flex-col">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label={t("card.moveUp", { team: tn(team) })}
          className="px-1 text-xs text-ink-dim disabled:opacity-20 hover:text-volt"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={index === 3}
          onClick={() => onMove(index, index + 1)}
          aria-label={t("card.moveDown", { team: tn(team) })}
          className="px-1 text-xs text-ink-dim disabled:opacity-20 hover:text-volt"
        >
          ▼
        </button>
      </span>
    </li>
  );
}

export function GroupCard({ group }: { group: GroupId }) {
  const ranking = usePredictionStore((s) => s.groupRankings[group]);
  const setGroupRanking = usePredictionStore((s) => s.setGroupRanking);
  const ensureGroupDefault = usePredictionStore((s) => s.ensureGroupDefault);
  const { t } = useT();

  useEffect(() => {
    ensureGroupDefault(group);
  }, [group, ensureGroupDefault]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!ranking || ranking.length !== 4) return null;

  const move = (from: number, to: number) =>
    setGroupRanking(group, arrayMove(ranking, from, to));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    move(ranking.indexOf(String(active.id)), ranking.indexOf(String(over.id)));
  };

  return (
    <section aria-label={t("card.groupAria", { group })} className="glass p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg uppercase">
          {t("group")} <span className="text-volt">{group}</span>
        </h3>
        <p className="text-[11px] uppercase tracking-wider text-ink-faint">
          {t("card.hint")}
        </p>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ranking} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {ranking.map((teamId, i) => (
              <SortableRow
                key={teamId}
                teamId={teamId}
                index={i}
                group={group}
                onMove={move}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </section>
  );
}
