export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type TokenKind = Note | "GOLD_REST";
export type CardTier = 1 | 2 | 3;

export type TokenCost = Partial<Record<Note, number>>;

export interface ChordCard {
  id: string;
  tier: CardTier;
  title: string;
  subtitleKo: string;
  category: "Triad" | "7th" | "Progression";
  chordSymbol: string;
  notes: Note[];
  cost: TokenCost;
  bonus: Note;
  points: number;
  educationHint: string;
  soundNotes: string[];
}

export interface MaestroTile {
  id: string;
  name: string;
  nameKo: string;
  points: number;
  requirement: Partial<Record<Note, number>>;
  flavorText: string;
}

export interface PlayerState {
  id: string;
  name: string;
  score: number;
  tokens: Record<TokenKind, number>;
  builtCards: ChordCard[];
  heldCards: ChordCard[];
  maestroTiles: MaestroTile[];
}

export interface MarketState {
  tokenPool: Record<TokenKind, number>;
  decks: Record<CardTier, ChordCard[]>;
  visibleCards: Record<CardTier, ChordCard[]>;
  maestroTiles: MaestroTile[];
}

export interface GameState {
  players: PlayerState[];
  currentPlayerIndex: number;
  market: MarketState;
  phase: "idle" | "selectingTokens" | "building" | "holding" | "gameOver";
  selectedTokenAction?: "TAKE_3_DISTINCT" | "TAKE_2_SAME";
  selectedTokens: Note[];
  log: GameLogEntry[];
  winnerId?: string;
  settings: {
    maxTokensPerPlayer: number;
    maxHeldCards: number;
    targetScore: number;
    sameTokenRequiresAtLeastInPool: number;
  };
  turn: number;
  errorMessage?: string;
  toastMessage?: string;
  audioMuted: boolean;
}

export interface GameLogEntry {
  id: string;
  turn: number;
  playerId: string;
  message: string;
  createdAt: string;
}

export type TokenAction = "TAKE_3_DISTINCT" | "TAKE_2_SAME";

export type RuleResult<T> =
  | {
      ok: true;
      state: T;
      message?: string;
      awardedMaestros?: MaestroTile[];
      builtCard?: ChordCard;
    }
  | {
      ok: false;
      error: string;
    };
