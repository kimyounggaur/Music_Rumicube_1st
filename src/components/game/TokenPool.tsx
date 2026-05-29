"use client";

import { Music2 } from "lucide-react";
import { NOTES } from "@/lib/game/constants";
import { TokenButton } from "@/components/game/TokenButton";
import type { GameState } from "@/lib/game/types";
import { Button } from "@/components/ui/button";

interface TokenPoolProps {
  game: GameState;
  onOpen: () => void;
}

export function TokenPool({ game, onOpen }: TokenPoolProps): React.ReactElement {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">음계 토큰 풀</h2>
        <Button variant="outline" size="sm" onClick={onOpen}>
          <Music2 className="size-4" />
          토큰 가져오기
        </Button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {NOTES.map((note) => (
          <TokenButton key={note} token={note} count={game.market.tokenPool[note]} onClick={onOpen} />
        ))}
        <TokenButton token="GOLD_REST" count={game.market.tokenPool.GOLD_REST} disabled />
      </div>
    </section>
  );
}
