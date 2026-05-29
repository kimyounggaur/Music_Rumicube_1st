"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, FlaskConical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";

export default function HomePage(): React.ReactElement {
  const router = useRouter();
  const startNewGame = useGameStore((state) => state.startNewGame);

  return (
    <main className="notion-page min-h-dvh bg-white px-5 py-6">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm font-semibold text-[var(--muted)]">Harmony Builder</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">하모니 빌더</h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
            도, 레, 미, 파, 솔, 라, 시 토큰을 모아 코드를 만들고, 완성한 코드로 다음 코드를 더 쉽게
            빌드하는 음악 교육용 엔진 빌딩 게임입니다.
          </p>
        </div>

        <div className="grid gap-3">
          <Button
            className="w-full"
            onClick={() => {
              startNewGame();
              router.push("/game");
            }}
          >
            <Play className="size-4" />새 게임 시작
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/game")}>
            <ArrowRight className="size-4" />
            이어하기
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 text-sm font-semibold" href="/tutorial">
              <BookOpen className="size-4" />
              튜토리얼 보기
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 text-sm font-semibold" href="/lab">
              <FlaskConical className="size-4" />
              사운드 랩
            </Link>
          </div>
        </div>

        <section className="grid gap-3">
          {[
            ["음을 모아 코드를 만든다", "각 음계 토큰은 코드의 재료입니다."],
            ["코드가 다음 코드를 쉽게 만든다", "완성한 카드의 bonus가 비용을 줄입니다."],
            ["화성 진행을 듣는다", "카드를 빌드하는 순간 실제 화음이 재생됩니다."]
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
