"use client";

import { create } from "zustand";
import { STORAGE_KEY } from "@/lib/game/constants";
import { playChord, playTokenClick, setAudioMuted } from "@/lib/audio/harmonyAudio";
import { buildCard as buildCardRule, holdCard as holdCardRule, takeTokens } from "@/lib/game/rules";
import { createInitialGameState } from "@/lib/game/setup";
import type { GameState, Note, TokenAction } from "@/lib/game/types";

interface GameStore {
  game: GameState;
  hydrated: boolean;
  startNewGame(playerNames?: string[]): void;
  loadGame(): void;
  saveGame(): void;
  selectTokenAction(action: TokenAction): void;
  toggleSelectedToken(note: Note): void;
  confirmTakeTokens(): void;
  buildCard(cardId: string, source: "market" | "held"): Promise<void>;
  holdCard(cardId: string): void;
  endTurn(): void;
  resetGame(): void;
  clearMessage(): void;
  toggleMute(): void;
}

function persist(game: GameState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

function loadPersisted(): GameState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return undefined;
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: createInitialGameState({ shuffle: false }),
  hydrated: false,

  startNewGame(playerNames) {
    const game = createInitialGameState({ playerNames });
    persist(game);
    set({ game, hydrated: true });
  },

  loadGame() {
    const game = loadPersisted() ?? createInitialGameState({ shuffle: false });
    setAudioMuted(game.audioMuted);
    set({ game, hydrated: true });
  },

  saveGame() {
    persist(get().game);
  },

  selectTokenAction(action) {
    set(({ game }) => ({
      game: {
        ...game,
        phase: "selectingTokens",
        selectedTokenAction: action,
        selectedTokens: [],
        errorMessage: undefined
      }
    }));
  },

  toggleSelectedToken(note) {
    const { game } = get();
    const action = game.selectedTokenAction;
    if (!action) {
      return;
    }

    void playTokenClick(note);
    const selected = new Set(game.selectedTokens);
    if (action === "TAKE_2_SAME") {
      set({
        game: {
          ...game,
          selectedTokens: selected.has(note) ? [] : [note],
          errorMessage: undefined
        }
      });
      return;
    }

    if (selected.has(note)) {
      selected.delete(note);
    } else if (selected.size < 3) {
      selected.add(note);
    }
    set({
      game: {
        ...game,
        selectedTokens: [...selected],
        errorMessage: undefined
      }
    });
  },

  confirmTakeTokens() {
    const { game } = get();
    if (!game.selectedTokenAction) {
      set({ game: { ...game, errorMessage: "먼저 가져올 토큰 방식을 선택해 주세요." } });
      return;
    }
    const result = takeTokens(game, game.selectedTokens, game.selectedTokenAction);
    if (!result.ok) {
      set({ game: { ...game, errorMessage: result.error } });
      return;
    }
    persist(result.state);
    set({ game: result.state });
  },

  async buildCard(cardId, source) {
    const { game } = get();
    const result = buildCardRule(game, cardId, source);
    if (!result.ok) {
      set({ game: { ...game, errorMessage: result.error } });
      return;
    }
    persist(result.state);
    set({ game: result.state });
    if (!result.state.audioMuted && result.builtCard) {
      await playChord(result.builtCard.soundNotes);
    }
  },

  holdCard(cardId) {
    const { game } = get();
    const result = holdCardRule(game, cardId);
    if (!result.ok) {
      set({ game: { ...game, errorMessage: result.error } });
      return;
    }
    persist(result.state);
    set({ game: result.state });
  },

  endTurn() {
    set(({ game }) => {
      const next = {
        ...game,
        currentPlayerIndex: (game.currentPlayerIndex + 1) % game.players.length,
        selectedTokens: [],
        selectedTokenAction: undefined,
        phase: "idle" as const,
        turn: game.turn + 1
      };
      persist(next);
      return { game: next };
    });
  },

  resetGame() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    const game = createInitialGameState({ shuffle: false });
    set({ game, hydrated: true });
  },

  clearMessage() {
    set(({ game }) => ({
      game: {
        ...game,
        errorMessage: undefined,
        toastMessage: undefined
      }
    }));
  },

  toggleMute() {
    set(({ game }) => {
      const next = { ...game, audioMuted: !game.audioMuted };
      setAudioMuted(next.audioMuted);
      persist(next);
      return { game: next };
    });
  }
}));
