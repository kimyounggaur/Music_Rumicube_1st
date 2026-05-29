import { Check } from "lucide-react";
import { NOTE_META } from "@/lib/game/constants";
import type { TokenKind } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface TokenButtonProps {
  token: TokenKind;
  count: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function TokenButton({
  token,
  count,
  selected = false,
  disabled = false,
  onClick
}: TokenButtonProps): React.ReactElement {
  const meta = NOTE_META[token];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex min-h-16 min-w-16 flex-col items-center justify-center rounded-full border border-[var(--border)] px-3 text-sm font-semibold shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-40",
        selected && "scale-[1.03] border-[#191919] ring-2 ring-[#191919]/10"
      )}
      style={{ backgroundColor: `var(${meta.cssVar})` }}
      aria-pressed={selected}
    >
      <span>{meta.short}</span>
      <span className="text-[10px] text-[var(--muted)]">{token === "GOLD_REST" ? "REST" : token}</span>
      <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border border-[var(--border)] bg-white text-xs">
        {count}
      </span>
      {selected ? <Check className="absolute bottom-1 size-3" /> : null}
    </button>
  );
}
