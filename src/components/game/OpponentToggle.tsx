"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NOTE_META, NOTES } from "@/lib/game/constants";
import { calculateDiscounts } from "@/lib/game/rules";
import { opponentPlayer, tokenCount } from "@/lib/game/selectors";
import type { GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface OpponentToggleProps {
  game: GameState;
}

export function OpponentToggle({ game }: OpponentToggleProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const opponent = opponentPlayer(game.players, game.currentPlayerIndex);
  const discounts = calculateDiscounts(opponent);
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white">
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between px-4 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-2 font-semibold">
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          Opponent · {opponent.score}점
        </span>
        <span className="text-sm text-[var(--muted)]">토큰 {tokenCount(opponent)}</span>
      </button>
      <div className={cn("grid transition-all", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-[var(--border)] p-4">
            <p className="text-sm text-[var(--muted)]">
              보관 {opponent.heldCards.length}/{game.settings.maxHeldCards} · 완성 {opponent.builtCards.length}장
            </p>
            <div className="flex flex-wrap gap-2">
              {NOTES.map((note) =>
                discounts[note] > 0 ? (
                  <Badge key={note} style={{ backgroundColor: `var(${NOTE_META[note].cssVar})` }}>
                    {NOTE_META[note].label} x{discounts[note]}
                  </Badge>
                ) : null
              )}
              {opponent.builtCards.length === 0 ? (
                <span className="text-sm text-[var(--muted)]">아직 영구 할인이 없습니다.</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
