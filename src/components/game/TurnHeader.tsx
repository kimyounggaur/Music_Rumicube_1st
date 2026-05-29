import { BookOpen, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameState } from "@/lib/game/types";
import { tokenCount } from "@/lib/game/selectors";

interface TurnHeaderProps {
  game: GameState;
  onRules: () => void;
  onReset: () => void;
  onMute: () => void;
}

export function TurnHeader({ game, onRules, onReset, onMute }: TurnHeaderProps): React.ReactElement {
  const player = game.players[game.currentPlayerIndex];
  return (
    <header className="sticky top-0 z-30 -mx-4 border-b border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:rounded-2xl md:border md:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Turn {game.turn}</p>
          <h1 className="mt-1 text-xl font-bold">♪ {player.name}의 턴</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {player.score}점 · 토큰 {tokenCount(player)}/{game.settings.maxTokensPerPlayer} · 보관{" "}
            {player.heldCards.length}/{game.settings.maxHeldCards}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" onClick={onRules} aria-label="규칙 보기">
            <BookOpen className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onMute} aria-label="음소거">
            {game.audioMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="게임 초기화">
            <RotateCcw className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
