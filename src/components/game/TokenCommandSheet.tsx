"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenButton } from "@/components/game/TokenButton";
import { NOTES } from "@/lib/game/constants";
import type { GameState } from "@/lib/game/types";
import { useGameStore } from "@/store/gameStore";

interface TokenCommandSheetProps {
  game: GameState;
  open: boolean;
  onClose: () => void;
}

export function TokenCommandSheet({ game, open, onClose }: TokenCommandSheetProps): React.ReactElement | null {
  const selectTokenAction = useGameStore((state) => state.selectTokenAction);
  const toggleSelectedToken = useGameStore((state) => state.toggleSelectedToken);
  const confirmTakeTokens = useGameStore((state) => state.confirmTakeTokens);

  if (!open) {
    return null;
  }

  const action = game.selectedTokenAction;
  const selected = new Set(game.selectedTokens);
  const canConfirm =
    (action === "TAKE_3_DISTINCT" && selected.size === 3) ||
    (action === "TAKE_2_SAME" && selected.size === 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/10" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" type="button" onClick={onClose} aria-label="닫기" />
      <motion.section
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-[var(--border)] bg-white p-4 shadow-2xl"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">토큰 가져오기</h2>
              <p className="text-sm text-[var(--muted)]">이번 턴에 가져갈 음을 고르세요.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
              <X className="size-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={action === "TAKE_3_DISTINCT" ? "primary" : "outline"}
              onClick={() => selectTokenAction("TAKE_3_DISTINCT")}
            >
              서로 다른 3개
            </Button>
            <Button
              variant={action === "TAKE_2_SAME" ? "primary" : "outline"}
              onClick={() => selectTokenAction("TAKE_2_SAME")}
            >
              같은 음 2개
            </Button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {NOTES.map((note) => (
              <TokenButton
                key={note}
                token={note}
                count={game.market.tokenPool[note]}
                selected={selected.has(note)}
                disabled={game.market.tokenPool[note] <= 0}
                onClick={() => toggleSelectedToken(note)}
              />
            ))}
          </div>

          {game.errorMessage ? (
            <p className="rounded-2xl bg-[var(--panel)] p-3 text-sm text-[var(--muted)]">{game.errorMessage}</p>
          ) : null}

          <Button
            className="w-full"
            disabled={!canConfirm}
            onClick={() => {
              confirmTakeTokens();
              onClose();
            }}
          >
            선택 완료
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
