"use client";

import { ChevronUp, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NOTE_META, NOTES } from "@/lib/game/constants";
import { calculateDiscounts } from "@/lib/game/rules";
import { tokenCount } from "@/lib/game/selectors";
import type { PlayerState } from "@/lib/game/types";

interface PlayerDockProps {
  player: PlayerState;
  maxTokens: number;
  onOpenInventory: () => void;
}

export function PlayerDock({ player, maxTokens, onOpenInventory }: PlayerDockProps): React.ReactElement {
  const discounts = calculateDiscounts(player);
  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">
            내 점수: {player.score}점 | <Music className="inline size-4" /> 보유 토큰: {tokenCount(player)}/{maxTokens}
          </p>
          <div className="mt-1 flex gap-1 overflow-hidden">
            {NOTES.map((note) =>
              discounts[note] > 0 ? (
                <Badge key={note} style={{ backgroundColor: `var(${NOTE_META[note].cssVar})` }}>
                  {NOTE_META[note].label} x{discounts[note]}
                </Badge>
              ) : null
            )}
            {player.builtCards.length === 0 ? <span className="text-xs text-[var(--muted)]">영구 할인 없음</span> : null}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenInventory}>
          <ChevronUp className="size-4" />
          인벤토리
        </Button>
      </div>
    </aside>
  );
}
