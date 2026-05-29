"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/game/types";

interface VictoryDialogProps {
  game: GameState;
  onNewGame: () => void;
}

export function VictoryDialog({ game, onNewGame }: VictoryDialogProps): React.ReactElement | null {
  if (game.phase !== "gameOver" || !game.winnerId) {
    return null;
  }
  const winner = game.players.find((player) => player.id === game.winnerId);
  if (!winner) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/25 p-4" role="dialog" aria-modal="true">
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mt-24 max-w-md rounded-[28px] border border-[var(--border)] bg-white p-6 text-center shadow-2xl"
      >
        <Trophy className="mx-auto size-12 text-[#8b741e]" />
        <h2 className="mt-4 text-2xl font-bold">{winner.name} 승리!</h2>
        <p className="mt-2 text-[var(--muted)]">
          {winner.score}점으로 하모니를 완성했습니다. 완성 코드 {winner.builtCards.length}장, 마에스트로{" "}
          {winner.maestroTiles.length}개를 모았습니다.
        </p>
        <Button className="mt-5 w-full" onClick={onNewGame}>
          새 게임 시작
        </Button>
      </motion.section>
    </div>
  );
}
