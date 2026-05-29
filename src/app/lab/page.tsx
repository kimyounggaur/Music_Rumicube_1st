"use client";

import Link from "next/link";
import { ArrowLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_CARDS } from "@/lib/game/cards";
import { NOTE_META } from "@/lib/game/constants";
import { playChord } from "@/lib/audio/harmonyAudio";

export default function LabPage(): React.ReactElement {
  return (
    <main className="min-h-dvh bg-white px-5 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/game">
          <Button variant="ghost">
            <ArrowLeft className="size-4" />
            게임으로
          </Button>
        </Link>
        <header className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5">
          <h1 className="text-3xl font-black">사운드 / 카드 랩</h1>
          <p className="mt-2 text-[var(--muted)]">카드를 눌러 화음과 진행 사운드를 테스트합니다.</p>
        </header>
        <section className="grid gap-3 sm:grid-cols-2">
          {ALL_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              className="rounded-2xl border border-[var(--border)] bg-white p-4 text-left transition hover:bg-[var(--panel)]"
              onClick={() => void playChord(card.soundNotes)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{card.title}</h2>
                  <p className="text-sm text-[var(--muted)]">{card.subtitleKo}</p>
                </div>
                <Volume2 className="size-4" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge style={{ backgroundColor: `var(${NOTE_META[card.bonus].cssVar})` }}>
                  {NOTE_META[card.bonus].label}
                </Badge>
                <Badge>{card.category}</Badge>
                <Badge>{card.points}점</Badge>
              </div>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
