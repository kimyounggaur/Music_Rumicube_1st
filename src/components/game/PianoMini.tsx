import { NOTES } from "@/lib/game/constants";
import type { Note } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface PianoMiniProps {
  notes: Note[];
  large?: boolean;
}

const blackKeys = new Set(["D", "E", "G", "A", "B"]);

export function PianoMini({ notes, large = false }: PianoMiniProps): React.ReactElement {
  const active = new Set(notes);
  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-1 rounded-2xl border border-[var(--border)] bg-white p-2",
        large ? "h-24" : "h-14"
      )}
      aria-label={`피아노 건반: ${notes.join(", ")}`}
    >
      {NOTES.map((note) => (
        <div
          key={note}
          className={cn(
            "relative flex items-end justify-center rounded-lg border border-[var(--border)] pb-1 text-[10px] font-semibold",
            blackKeys.has(note) ? "bg-[#f0f0ee]" : "bg-white",
            active.has(note) && "border-[#191919] ring-2 ring-[#191919]/10"
          )}
          style={active.has(note) ? { backgroundColor: `var(--note-${note.toLowerCase()})` } : undefined}
        >
          {note}
        </div>
      ))}
    </div>
  );
}
