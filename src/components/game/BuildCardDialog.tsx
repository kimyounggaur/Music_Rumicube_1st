"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationHint } from "@/components/game/EducationHint";
import { PianoMini } from "@/components/game/PianoMini";
import { NOTE_META, NOTES } from "@/lib/game/constants";
import { buildSummary, costRows } from "@/lib/game/selectors";
import type { ChordCard, PlayerState } from "@/lib/game/types";
import { useGameStore } from "@/store/gameStore";

interface BuildCardDialogProps {
  card?: ChordCard;
  source: "market" | "held";
  player: PlayerState;
  onClose: () => void;
}

export function BuildCardDialog({ card, source, player, onClose }: BuildCardDialogProps): React.ReactElement | null {
  const buildCard = useGameStore((state) => state.buildCard);
  const holdCard = useGameStore((state) => state.holdCard);
  if (!card) {
    return null;
  }

  const summary = buildSummary(player, card);
  const rows = costRows(player, card);

  return (
    <div className="fixed inset-0 z-50 bg-black/20 p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" type="button" onClick={onClose} aria-label="닫기" />
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mt-10 max-w-lg rounded-[28px] border border-[var(--border)] bg-white p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge style={{ backgroundColor: `var(${NOTE_META[card.bonus].cssVar})` }}>
              {NOTE_META[card.bonus].label} 할인
            </Badge>
            <h2 className="mt-3 text-2xl font-bold">{card.title}</h2>
            <p className="text-[var(--muted)]">
              {card.subtitleKo} · {card.points}점
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
            <X className="size-5" />
          </Button>
        </div>

        <div className="mt-4">
          <PianoMini notes={card.notes} large />
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--border)] p-3">
          <h3 className="font-semibold">빌드 비용</h3>
          <div className="mt-2 space-y-2">
            {rows.map((row) => (
              <div key={row.note} className="flex items-center justify-between gap-3 text-sm">
                <span>{NOTE_META[row.note].label}</span>
                <span className="text-[var(--muted)]">
                  기본 {row.printed} · 할인 {row.discount} · 지불 {row.effective} · 보유 {row.owned}
                </span>
              </div>
            ))}
          </div>
          {summary.goldNeeded > 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              황금 쉼표 {summary.goldNeeded}개를 사용하면 부족한 음을 대신할 수 있습니다.
            </p>
          ) : null}
          {!summary.canBuild ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              부족한 음:{" "}
              {NOTES.filter((note) => (summary.missing[note] ?? 0) > 0)
                .map((note) => `${NOTE_META[note].label} ${summary.missing[note]}개`)
                .join(", ")}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <EducationHint hint={card.educationHint} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            disabled={!summary.canBuild}
            onClick={async () => {
              await buildCard(card.id, source);
              onClose();
            }}
          >
            코드 빌드하기 Build
          </Button>
          <Button
            variant="outline"
            disabled={source === "held"}
            onClick={() => {
              holdCard(card.id);
              onClose();
            }}
          >
            보관하기 Hold
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
