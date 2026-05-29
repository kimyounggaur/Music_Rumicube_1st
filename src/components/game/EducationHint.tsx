import { Lightbulb } from "lucide-react";

interface EducationHintProps {
  hint: string;
  compact?: boolean;
}

export function EducationHint({ hint, compact = false }: EducationHintProps): React.ReactElement {
  if (compact) {
    return <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{hint}</p>;
  }

  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <Lightbulb className="size-4" />
        음악 힌트
      </summary>
      <p className="mt-2 leading-relaxed text-[var(--muted)]">{hint}</p>
    </details>
  );
}
