import { NOTE_META, NOTES, TOKEN_KINDS } from "./constants";
import type { GameLogEntry, GameState, Note, PlayerState, TokenKind } from "./types";

export function emptyTokenRecord(value = 0): Record<TokenKind, number> {
  return TOKEN_KINDS.reduce(
    (record, token) => ({
      ...record,
      [token]: value
    }),
    {} as Record<TokenKind, number>
  );
}

export function emptyNoteRecord(value = 0): Record<Note, number> {
  return NOTES.reduce(
    (record, note) => ({
      ...record,
      [note]: value
    }),
    {} as Record<Note, number>
  );
}

export function totalTokens(tokens: Record<TokenKind, number>): number {
  return TOKEN_KINDS.reduce((sum, token) => sum + tokens[token], 0);
}

export function cloneGameState(state: GameState): GameState {
  return structuredClone(state) as GameState;
}

export function formatNotes(notes: Note[]): string {
  return notes.map((note) => NOTE_META[note].label).join(", ");
}

export function formatNoteSum(notes: Note[]): string {
  return notes.map((note) => NOTE_META[note].ko).join(" + ");
}

export function addLog(state: GameState, player: PlayerState, message: string): void {
  const entry: GameLogEntry = {
    id: `${Date.now()}-${state.log.length + 1}`,
    turn: state.turn,
    playerId: player.id,
    message,
    createdAt: new Date().toISOString()
  };
  state.log = [entry, ...state.log].slice(0, 80);
}

export function nextTurn(state: GameState): void {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.phase = "idle";
  state.selectedTokens = [];
  state.selectedTokenAction = undefined;
  state.turn += 1;
}

export function tokenStyle(note: TokenKind): Record<string, string> {
  return { backgroundColor: `var(${NOTE_META[note].cssVar})` };
}
