"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { BuildCardDialog } from "@/components/game/BuildCardDialog";
import { CardMarket } from "@/components/game/CardMarket";
import { HoldCardMenu } from "@/components/game/HoldCardMenu";
import { InventorySheet } from "@/components/game/InventorySheet";
import { MaestroStrip } from "@/components/game/MaestroStrip";
import { OpponentToggle } from "@/components/game/OpponentToggle";
import { PlayerDock } from "@/components/game/PlayerDock";
import { TokenCommandSheet } from "@/components/game/TokenCommandSheet";
import { TokenPool } from "@/components/game/TokenPool";
import { TurnHeader } from "@/components/game/TurnHeader";
import { VictoryDialog } from "@/components/game/VictoryDialog";
import { Button } from "@/components/ui/button";
import type { ChordCard } from "@/lib/game/types";
import { useGameStore } from "@/store/gameStore";

interface SelectedCard {
  card: ChordCard;
  source: "market" | "held";
}

function RulesPanel({ open, onClose }: { open: boolean; onClose: () => void }): React.ReactElement | null {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/10" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" type="button" onClick={onClose} aria-label="닫기" />
      <motion.section
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[28px] border border-[var(--border)] bg-white p-4 shadow-2xl"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="size-5" />
              규칙 보기
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
              <X className="size-5" />
            </Button>
          </div>
          {[
            ["토큰", "한 턴에는 서로 다른 음 3개 또는 같은 음 2개를 가져옵니다. 같은 음 2개는 풀에 4개 이상 있을 때만 가능합니다."],
            ["빌드", "카드 비용은 이미 완성한 코드의 bonus로 줄어듭니다. 부족한 음은 황금 쉼표로 대신 낼 수 있습니다."],
            ["보관", "공개 카드 1장을 보관하고 황금 쉼표 1개를 받을 수 있습니다. 보관 카드는 최대 3장입니다."],
            ["마에스트로", "특정 bonus 조합을 달성하면 마에스트로 타일을 자동으로 얻습니다."],
            ["승리", "먼저 15점 이상을 만들면 게임이 끝납니다."]
          ].map(([title, body]) => (
            <details key={title} open className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
              <summary className="cursor-pointer font-semibold">{title}</summary>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
            </details>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export function GameShell(): React.ReactElement {
  const game = useGameStore((state) => state.game);
  const hydrated = useGameStore((state) => state.hydrated);
  const loadGame = useGameStore((state) => state.loadGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const clearMessage = useGameStore((state) => state.clearMessage);
  const toggleMute = useGameStore((state) => state.toggleMute);

  const [tokenOpen, setTokenOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | undefined>();
  const [menuCard, setMenuCard] = useState<ChordCard | undefined>();

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (!game.toastMessage && !game.errorMessage) {
      return;
    }
    const timeout = window.setTimeout(clearMessage, 2800);
    return () => window.clearTimeout(timeout);
  }, [clearMessage, game.errorMessage, game.toastMessage]);

  const player = game.players[game.currentPlayerIndex];

  if (!hydrated) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white p-6">
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted)]">
          게임을 불러오는 중입니다.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white px-4 pb-36 pt-3 text-[var(--text)]">
      <div className="mx-auto max-w-3xl space-y-5">
        <TurnHeader game={game} onRules={() => setRulesOpen(true)} onReset={resetGame} onMute={toggleMute} />
        <OpponentToggle game={game} />
        <MaestroStrip game={game} />
        <CardMarket
          game={game}
          onOpen={(card, source) => setSelectedCard({ card, source })}
          onMenu={(card) => setMenuCard(card)}
        />
        <TokenPool game={game} onOpen={() => setTokenOpen(true)} />
      </div>

      <PlayerDock
        player={player}
        maxTokens={game.settings.maxTokensPerPlayer}
        onOpenInventory={() => setInventoryOpen(true)}
      />

      <AnimatePresence>
        {game.toastMessage || game.errorMessage ? (
          <motion.div
            key={`${game.toastMessage ?? ""}${game.errorMessage ?? ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-white p-3 text-sm shadow-lg"
          >
            {game.errorMessage ?? game.toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <TokenCommandSheet game={game} open={tokenOpen} onClose={() => setTokenOpen(false)} />
      <BuildCardDialog
        card={selectedCard?.card}
        source={selectedCard?.source ?? "market"}
        player={player}
        onClose={() => setSelectedCard(undefined)}
      />
      <HoldCardMenu
        card={menuCard}
        onClose={() => setMenuCard(undefined)}
        onBuild={() => {
          if (menuCard) {
            setSelectedCard({ card: menuCard, source: "market" });
          }
          setMenuCard(undefined);
        }}
      />
      <InventorySheet
        game={game}
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        onOpenCard={(card) => setSelectedCard({ card, source: "held" })}
      />
      <RulesPanel open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <VictoryDialog game={game} onNewGame={resetGame} />
    </main>
  );
}
