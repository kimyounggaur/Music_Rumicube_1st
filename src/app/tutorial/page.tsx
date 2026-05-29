import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const blocks = [
  {
    title: "1. 음계 토큰",
    body: "도(C), 레(D), 미(E), 파(F), 솔(G), 라(A), 시(B)는 코드를 만들기 위한 재료입니다. 한 턴에는 서로 다른 음 3개 또는 같은 음 2개를 가져옵니다."
  },
  {
    title: "2. 코드 카드",
    body: "Triad는 기본 3화음, 7th는 네 음짜리 화음, Progression은 여러 화음이 이어지는 진행입니다. 카드 비용을 내면 내 완성 코드가 됩니다."
  },
  {
    title: "3. 할인 엔진",
    body: "완성한 카드의 bonus 음은 앞으로 그 음 비용을 1개 줄입니다. 이미 만든 코드가 다음 코드를 쉽게 만드는 구조입니다."
  },
  {
    title: "4. 공통음 Common Tone",
    body: "음악에서는 한 화음의 음이 다음 화음에도 이어질 때 흐름이 자연스러워집니다. 하모니 빌더의 bonus 할인은 이 공통음 활용을 게임 규칙으로 표현합니다."
  },
  {
    title: "5. 황금 쉼표",
    body: "황금 쉼표는 부족한 음 하나를 대신 낼 수 있는 조커 토큰입니다. 카드를 보관하면 받을 수 있습니다."
  },
  {
    title: "6. 마에스트로와 승리",
    body: "특정 bonus 조합을 모으면 마에스트로 타일을 얻습니다. 먼저 15점 이상을 만들면 승리합니다."
  }
];

export default function TutorialPage(): React.ReactElement {
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
          <Music2 className="size-8" />
          <h1 className="mt-3 text-3xl font-black">튜토리얼</h1>
          <p className="mt-2 text-[var(--muted)]">3분 안에 첫 턴을 시작할 수 있게 핵심 규칙만 정리했습니다.</p>
        </header>
        <section className="space-y-3">
          {blocks.map((block) => (
            <details key={block.title} open className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <summary className="cursor-pointer text-lg font-bold">{block.title}</summary>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{block.body}</p>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
