import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NOTE_META } from "@/lib/game/constants";
import { maestroProgress } from "@/lib/game/selectors";
import type { GameState } from "@/lib/game/types";

interface MaestroStripProps {
  game: GameState;
}

export function MaestroStrip({ game }: MaestroStripProps): React.ReactElement {
  const player = game.players[game.currentPlayerIndex];
  return (
    <section className="space-y-2 rounded-2xl border-l-4 border-l-[#c7b36b] bg-[var(--panel)] p-4">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-[#8b741e]" />
        <h2 className="font-bold">마에스트로 타일</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {game.market.maestroTiles.map((tile) => {
          const progress = maestroProgress(player, tile);
          const complete = progress.every((item) => item.complete);
          return (
            <article
              key={tile.id}
              className="min-w-[240px] rounded-2xl border border-[var(--border)] bg-white p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  {tile.nameKo} <span className="text-xs text-[var(--muted)]">{tile.name}</span>
                </h3>
                <Badge className={complete ? "border-[#8b741e] bg-[var(--note-gold)] text-[#5f4a00]" : ""}>
                  {tile.points}점
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {progress.map((item) => (
                  <Badge
                    key={item.note}
                    style={{ backgroundColor: item.complete ? `var(${NOTE_META[item.note].cssVar})` : undefined }}
                  >
                    {NOTE_META[item.note].label} {item.owned}/{item.required}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{tile.flavorText}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
