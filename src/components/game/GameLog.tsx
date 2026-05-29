import type { GameLogEntry } from "@/lib/game/types";

interface GameLogProps {
  log: GameLogEntry[];
}

export function GameLog({ log }: GameLogProps): React.ReactElement {
  return (
    <div className="space-y-2">
      {log.map((entry) => (
        <article key={entry.id} className="rounded-2xl border border-[var(--border)] bg-white p-3">
          <p className="text-sm leading-relaxed">{entry.message}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">턴 {entry.turn}</p>
        </article>
      ))}
    </div>
  );
}
