"use client";

import { motion } from "framer-motion";
import { Archive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChordCard } from "@/lib/game/types";
import { useGameStore } from "@/store/gameStore";

interface HoldCardMenuProps {
  card?: ChordCard;
  onClose: () => void;
  onBuild: () => void;
}

export function HoldCardMenu({ card, onClose, onBuild }: HoldCardMenuProps): React.ReactElement | null {
  const holdCard = useGameStore((state) => state.holdCard);
  if (!card) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/10" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" type="button" onClick={onClose} aria-label="닫기" />
      <motion.section
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-[var(--border)] bg-white p-4 shadow-2xl"
      >
        <div className="mx-auto max-w-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p className="text-sm text-[var(--muted)]">카드 메뉴</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
              <X className="size-5" />
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              holdCard(card.id);
              onClose();
            }}
          >
            <Archive className="size-4" />
            보관하기 Hold
          </Button>
          <Button className="w-full" onClick={onBuild}>
            자세히 보고 빌드하기
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
