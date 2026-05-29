import { NOTES } from "./constants";
import type { ChordCard, MaestroTile, Note, PlayerState, TokenCost } from "./types";
import { calculateDiscounts, calculateEffectiveCost, canAffordCard } from "./rules";
import { emptyNoteRecord, totalTokens } from "./utils";

export function currentPlayer(players: PlayerState[], index: number): PlayerState {
  return players[index];
}

export function opponentPlayer(players: PlayerState[], index: number): PlayerState {
  return players[(index + 1) % players.length];
}

export function tokenCount(player: PlayerState): number {
  return totalTokens(player.tokens);
}

export function groupedBuiltCards(player: PlayerState): Record<Note, ChordCard[]> {
  return NOTES.reduce(
    (groups, note) => ({
      ...groups,
      [note]: player.builtCards.filter((card) => card.bonus === note)
    }),
    {} as Record<Note, ChordCard[]>
  );
}

export function costRows(player: PlayerState, card: ChordCard): Array<{
  note: Note;
  printed: number;
  discount: number;
  effective: number;
  owned: number;
  satisfied: boolean;
}> {
  const discounts = calculateDiscounts(player);
  const effective = calculateEffectiveCost(player, card);
  return NOTES.filter((note) => (card.cost[note] ?? 0) > 0).map((note) => ({
    note,
    printed: card.cost[note] ?? 0,
    discount: discounts[note],
    effective: effective[note] ?? 0,
    owned: player.tokens[note],
    satisfied: player.tokens[note] >= (effective[note] ?? 0)
  }));
}

export function buildSummary(player: PlayerState, card: ChordCard): {
  cost: TokenCost;
  canBuild: boolean;
  goldNeeded: number;
  missing: TokenCost;
} {
  const affordability = canAffordCard(player, card);
  return {
    cost: calculateEffectiveCost(player, card),
    canBuild: affordability.canBuild,
    goldNeeded: affordability.goldNeeded,
    missing: affordability.missing
  };
}

export function maestroProgress(player: PlayerState, tile: MaestroTile): Array<{
  note: Note;
  required: number;
  owned: number;
  complete: boolean;
}> {
  const discounts = calculateDiscounts(player);
  return NOTES.filter((note) => (tile.requirement[note] ?? 0) > 0).map((note) => ({
    note,
    required: tile.requirement[note] ?? 0,
    owned: discounts[note],
    complete: discounts[note] >= (tile.requirement[note] ?? 0)
  }));
}

export function normalizeCost(cost: TokenCost): Record<Note, number> {
  return { ...emptyNoteRecord(), ...cost };
}
