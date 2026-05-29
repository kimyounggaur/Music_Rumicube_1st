import { CARDS_BY_TIER } from "./cards";
import {
  DEFAULT_SETTINGS,
  NOTES,
  STARTING_GOLD_RESTS,
  STARTING_NOTE_TOKENS,
  VISIBLE_CARDS_PER_TIER,
  VISIBLE_MAESTROS
} from "./constants";
import { MAESTRO_TILES } from "./maestros";
import type { CardTier, ChordCard, GameState, MaestroTile, PlayerState } from "./types";
import { emptyTokenRecord } from "./utils";

interface CreateGameOptions {
  playerNames?: string[];
  shuffle?: boolean;
}

function shuffleArray<T>(items: T[], shouldShuffle: boolean): T[] {
  const result = [...items];
  if (!shouldShuffle) {
    return result;
  }
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function makePlayer(index: number, name?: string): PlayerState {
  return {
    id: `player-${index + 1}`,
    name: name?.trim() || `Player ${index + 1}`,
    score: 0,
    tokens: emptyTokenRecord(),
    builtCards: [],
    heldCards: [],
    maestroTiles: []
  };
}

function dealTier(tier: CardTier, shuffle: boolean): { deck: ChordCard[]; visible: ChordCard[] } {
  const cards = shuffleArray(CARDS_BY_TIER[tier], shuffle);
  return {
    visible: cards.slice(0, VISIBLE_CARDS_PER_TIER),
    deck: cards.slice(VISIBLE_CARDS_PER_TIER)
  };
}

function dealMaestros(shuffle: boolean): MaestroTile[] {
  return shuffleArray(MAESTRO_TILES, shuffle).slice(0, VISIBLE_MAESTROS);
}

export function createInitialGameState(options: CreateGameOptions = {}): GameState {
  const shuffle = options.shuffle ?? true;
  const tier1 = dealTier(1, shuffle);
  const tier2 = dealTier(2, shuffle);
  const tier3 = dealTier(3, shuffle);
  const tokenPool = emptyTokenRecord();
  NOTES.forEach((note) => {
    tokenPool[note] = STARTING_NOTE_TOKENS;
  });
  tokenPool.GOLD_REST = STARTING_GOLD_RESTS;

  return {
    players: [makePlayer(0, options.playerNames?.[0]), makePlayer(1, options.playerNames?.[1])],
    currentPlayerIndex: 0,
    market: {
      tokenPool,
      decks: {
        1: tier1.deck,
        2: tier2.deck,
        3: tier3.deck
      },
      visibleCards: {
        1: tier1.visible,
        2: tier2.visible,
        3: tier3.visible
      },
      maestroTiles: dealMaestros(shuffle)
    },
    phase: "idle",
    selectedTokens: [],
    log: [
      {
        id: "game-start",
        turn: 1,
        playerId: "system",
        message: "새 하모니 빌더 게임을 시작했습니다.",
        createdAt: new Date().toISOString()
      }
    ],
    settings: { ...DEFAULT_SETTINGS },
    turn: 1,
    audioMuted: false
  };
}
