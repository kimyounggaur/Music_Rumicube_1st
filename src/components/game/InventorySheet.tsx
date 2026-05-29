"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChordCard } from "@/components/game/ChordCard";
import { GameLog } from "@/components/game/GameLog";
import { NOTE_META, NOTES, TOKEN_KINDS } from "@/lib/game/constants";
import { groupedBuiltCards } from "@/lib/game/selectors";
import type { ChordCard as ChordCardType, GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface InventorySheetProps {
  game: GameState;
  open: boolean;
  onClose: () => void;
  onOpenCard: (card: ChordCardType) => void;
}

const tabs = ["토큰", "완성 코드", "보관 카드", "마에스트로", "로그"] as const;
type Tab = (typeof tabs)[number];

export function InventorySheet({
  game,
  open,
  onClose,
  onOpenCard
}: InventorySheetProps): React.ReactElement | null {
  const [tab, setTab] = useState<Tab>("토큰");
  if (!open) {
    return null;
  }

  const player = game.players[game.currentPlayerIndex];
  const groups = groupedBuiltCards(player);

  return (
    <div className="fixed inset-0 z-50 bg-black/10" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" type="button" onClick={onClose} aria-label="닫기" />
      <motion.section
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-hidden rounded-t-[28px] border border-[var(--border)] bg-white shadow-2xl"
      >
        <div className="mx-auto flex max-w-3xl flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <div>
              <h2 className="text-lg font-bold">{player.name} 인벤토리</h2>
              <p className="text-sm text-[var(--muted)]">완성한 코드와 학습 기록을 확인합니다.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
              <X className="size-5" />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-[var(--border)] px-4 py-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "min-h-10 rounded-full px-3 text-sm font-semibold",
                  tab === item ? "bg-[#191919] text-white" : "bg-[var(--panel)]"
                )}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="max-h-[64dvh] overflow-y-auto p-4">
            {tab === "토큰" ? (
              <div className="grid grid-cols-2 gap-2">
                {TOKEN_KINDS.map((token) => (
                  <div key={token} className="rounded-2xl border border-[var(--border)] p-3">
                    <p className="font-semibold">{NOTE_META[token].label}</p>
                    <p className="text-2xl font-bold">{player.tokens[token]}개</p>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === "완성 코드" ? (
              <div className="space-y-4">
                {NOTES.map((note) =>
                  groups[note].length > 0 ? (
                    <section key={note}>
                      <Badge style={{ backgroundColor: `var(${NOTE_META[note].cssVar})` }}>
                        {NOTE_META[note].label} x{groups[note].length}
                      </Badge>
                      <div className="mt-2 grid gap-2">
                        {groups[note].map((card) => (
                          <article key={card.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                            <p className="font-semibold">{card.title}</p>
                            <p className="text-sm text-[var(--muted)]">{card.educationHint}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null
                )}
                {player.builtCards.length === 0 ? <p className="text-sm text-[var(--muted)]">아직 완성한 코드가 없습니다.</p> : null}
              </div>
            ) : null}

            {tab === "보관 카드" ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {player.heldCards.map((card) => (
                  <ChordCard
                    key={card.id}
                    card={card}
                    player={player}
                    source="held"
                    onOpen={(card) => onOpenCard(card)}
                    onMenu={() => undefined}
                  />
                ))}
                {player.heldCards.length === 0 ? <p className="text-sm text-[var(--muted)]">보관한 카드가 없습니다.</p> : null}
              </div>
            ) : null}

            {tab === "마에스트로" ? (
              <div className="space-y-2">
                {player.maestroTiles.map((tile) => (
                  <article key={tile.id} className="rounded-2xl border border-[var(--border)] p-3">
                    <p className="font-semibold">{tile.nameKo}</p>
                    <p className="text-sm text-[var(--muted)]">{tile.flavorText}</p>
                  </article>
                ))}
                {player.maestroTiles.length === 0 ? <p className="text-sm text-[var(--muted)]">아직 획득한 타일이 없습니다.</p> : null}
              </div>
            ) : null}

            {tab === "로그" ? <GameLog log={game.log} /> : null}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
