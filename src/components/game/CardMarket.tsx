"use client";

import { CardMarketRow } from "@/components/game/CardMarketRow";
import type { ChordCard, GameState } from "@/lib/game/types";

interface CardMarketProps {
  game: GameState;
  onOpen: (card: ChordCard, source: "market" | "held") => void;
  onMenu: (card: ChordCard) => void;
}

export function CardMarket({ game, onOpen, onMenu }: CardMarketProps): React.ReactElement {
  const player = game.players[game.currentPlayerIndex];
  return (
    <div className="space-y-6">
      <CardMarketRow
        tier={1}
        title="Tier 1 · Triad"
        cards={game.market.visibleCards[1]}
        player={player}
        onOpen={onOpen}
        onMenu={onMenu}
      />
      <CardMarketRow
        tier={2}
        title="Tier 2 · 7th"
        cards={game.market.visibleCards[2]}
        player={player}
        onOpen={onOpen}
        onMenu={onMenu}
      />
      <CardMarketRow
        tier={3}
        title="Tier 3 · Progression"
        cards={game.market.visibleCards[3]}
        player={player}
        onOpen={onOpen}
        onMenu={onMenu}
      />
    </div>
  );
}
