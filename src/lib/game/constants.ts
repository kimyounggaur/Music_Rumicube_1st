import type { Note, TokenKind } from "./types";

export const NOTES: Note[] = ["C", "D", "E", "F", "G", "A", "B"];
export const TOKEN_KINDS: TokenKind[] = [...NOTES, "GOLD_REST"];

export const NOTE_META: Record<
  TokenKind,
  {
    ko: string;
    label: string;
    short: string;
    cssVar: string;
    sound: string;
  }
> = {
  C: { ko: "도", label: "도(C)", short: "도", cssVar: "--note-c", sound: "C4" },
  D: { ko: "레", label: "레(D)", short: "레", cssVar: "--note-d", sound: "D4" },
  E: { ko: "미", label: "미(E)", short: "미", cssVar: "--note-e", sound: "E4" },
  F: { ko: "파", label: "파(F)", short: "파", cssVar: "--note-f", sound: "F4" },
  G: { ko: "솔", label: "솔(G)", short: "솔", cssVar: "--note-g", sound: "G4" },
  A: { ko: "라", label: "라(A)", short: "라", cssVar: "--note-a", sound: "A4" },
  B: { ko: "시", label: "시(B)", short: "시", cssVar: "--note-b", sound: "B4" },
  GOLD_REST: {
    ko: "황금 쉼표",
    label: "황금 쉼표",
    short: "쉼",
    cssVar: "--note-gold",
    sound: "C5"
  }
};

export const DEFAULT_SETTINGS = {
  maxTokensPerPlayer: 10,
  maxHeldCards: 3,
  targetScore: 15,
  sameTokenRequiresAtLeastInPool: 4
} as const;

export const STARTING_NOTE_TOKENS = 5;
export const STARTING_GOLD_RESTS = 5;
export const VISIBLE_CARDS_PER_TIER = 4;
export const VISIBLE_MAESTROS = 3;
export const STORAGE_KEY = "harmony-builder-game";
