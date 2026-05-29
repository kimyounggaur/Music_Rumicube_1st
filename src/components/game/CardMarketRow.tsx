"use client";

import { ChordCard } from "@/components/game/ChordCard";
import type { CardTier, ChordCard as ChordCardType, PlayerState } from "@/lib/game/types";

interface CardMarketRowProps {
  tier: CardTier;
  title: string;
  cards: ChordCardType[];
  player: PlayerState;
  onOpen: (card: ChordCardType, source: "market" | "held") => void;
  onMenu: (card: ChordCardType) => void;
}

export function CardMarketRow({
  tier,
  title,
  cards,
  player,
  onOpen,
  onMenu
}: CardMarketRowProps): React.ReactElement {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-[var(--muted)]">Tier {tier}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map((card) => (
          <ChordCard key={card.id} card={card} player={player} onOpen={onOpen} onMenu={onMenu} />
        ))}
      </div>
    </section>
  );
}
