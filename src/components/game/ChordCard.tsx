"use client";

import { MoreHorizontal, Star } from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { EducationHint } from "@/components/game/EducationHint";
import { PianoMini } from "@/components/game/PianoMini";
import { NOTE_META, NOTES } from "@/lib/game/constants";
import { canAffordCard, calculateDiscounts, calculateEffectiveCost } from "@/lib/game/rules";
import type { ChordCard as ChordCardType, PlayerState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface ChordCardProps {
  card: ChordCardType;
  player: PlayerState;
  source?: "market" | "held";
  onOpen: (card: ChordCardType, source: "market" | "held") => void;
  onMenu: (card: ChordCardType) => void;
}

export function ChordCard({
  card,
  player,
  source = "market",
  onOpen,
  onMenu
}: ChordCardProps): React.ReactElement {
  const timerRef = useRef<number | null>(null);
  const affordability = canAffordCard(player, card);
  const effective = calculateEffectiveCost(player, card);
  const discounts = calculateDiscounts(player);

  function startPress(): void {
    if (source === "held") {
      return;
    }
    timerRef.current = window.setTimeout(() => onMenu(card), 550);
  }

  function endPress(): void {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <article
      className={cn(
        "min-w-[246px] max-w-[246px] rounded-2xl border bg-[var(--panel)] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition",
        affordability.canBuild ? "border-[#191919] ring-2 ring-[#191919]/10" : "border-[var(--border)]"
      )}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge style={{ backgroundColor: `var(${NOTE_META[card.bonus].cssVar})` }}>
          {NOTE_META[card.bonus].label}
        </Badge>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <Star className="size-4 fill-[#c7b36b] text-[#8b741e]" />
            {card.points}
          </span>
          {source === "market" ? (
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-white"
              onClick={(event) => {
                event.stopPropagation();
                onMenu(card);
              }}
              aria-label={`${card.title} 메뉴`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        onClick={() => onOpen(card, source)}
      >
        <h3 className="text-lg font-bold leading-tight">{card.title}</h3>
        <p className="text-sm text-[var(--muted)]">{card.subtitleKo}</p>
        <div className="mt-3">
          <PianoMini notes={card.notes} />
        </div>
        <div className="mt-3 space-y-1">
          {NOTES.filter((note) => (card.cost[note] ?? 0) > 0).map((note) => {
            const needed = effective[note] ?? 0;
            const satisfied = player.tokens[note] >= needed || needed === 0;
            return (
              <div key={note} className="flex items-center justify-between gap-2 text-xs">
                <span className={cn("flex items-center gap-1", !satisfied && "text-[var(--muted)]")}>
                  <span>{satisfied ? "✓" : "□"}</span>
                  {NOTE_META[note].label}
                </span>
                <span className="text-[var(--muted)]">
                  {player.tokens[note]}/{needed}
                  {discounts[note] ? ` · 할인 ${discounts[note]}` : ""}
                </span>
              </div>
            );
          })}
          {affordability.goldNeeded > 0 ? (
            <p className="text-xs text-[var(--muted)]">황금 쉼표 {affordability.goldNeeded}개로 부족한 음을 대체할 수 있습니다.</p>
          ) : null}
        </div>
        <div className="mt-3">
          <EducationHint hint={card.educationHint} compact />
        </div>
      </button>
    </article>
  );
}
