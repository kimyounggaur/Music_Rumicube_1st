import { describe, expect, it } from "vitest";
import { ALL_CARDS } from "./cards";
import { MAESTRO_TILES } from "./maestros";
import {
  buildCard,
  calculateDiscounts,
  calculateEffectiveCost,
  canAffordCard,
  holdCard,
  takeTokens
} from "./rules";
import { createInitialGameState } from "./setup";
import type { ChordCard, GameState, Note } from "./types";

function tierCard(state: GameState, tier: 1 | 2 | 3, title: string): ChordCard {
  const card = state.market.visibleCards[tier].find((item) => item.title === title);
  if (!card) {
    throw new Error(`Missing visible card ${title}`);
  }
  return card;
}

function ownedBonus(note: Note, id: string): ChordCard {
  return {
    ...ALL_CARDS[0],
    id,
    title: `${note} helper ${id}`,
    bonus: note,
    points: 0
  };
}

describe("Harmony Builder rules", () => {
  it("lets a player take 3 distinct available note tokens", () => {
    const state = createInitialGameState({ shuffle: false });
    const result = takeTokens(state, ["C", "E", "G"], "TAKE_3_DISTINCT");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.players[0].tokens.C).toBe(1);
    expect(result.state.players[0].tokens.E).toBe(1);
    expect(result.state.players[0].tokens.G).toBe(1);
    expect(result.state.market.tokenPool.C).toBe(4);
    expect(result.state.currentPlayerIndex).toBe(1);
  });

  it("only lets a player take 2 same tokens when at least 4 remain in the pool", () => {
    const state = createInitialGameState({ shuffle: false });
    state.market.tokenPool.C = 3;

    const result = takeTokens(state, ["C"], "TAKE_2_SAME");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("4개");
  });

  it("does not let a player exceed 10 total tokens", () => {
    const state = createInitialGameState({ shuffle: false });
    state.players[0].tokens = {
      C: 3,
      D: 2,
      E: 2,
      F: 2,
      G: 0,
      A: 0,
      B: 0,
      GOLD_REST: 0
    };

    const result = takeTokens(state, ["C", "E", "G"], "TAKE_3_DISTINCT");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("10개");
  });

  it("discounts card costs using built card bonuses", () => {
    const state = createInitialGameState({ shuffle: false });
    state.players[0].builtCards = [
      ownedBonus("C", "c-1"),
      ownedBonus("C", "c-2"),
      ownedBonus("E", "e-1")
    ];
    const card = {
      ...ALL_CARDS.find((item) => item.title === "Cmaj7")!,
      cost: { C: 3, E: 1, G: 1 }
    };

    expect(calculateDiscounts(state.players[0])).toEqual({
      C: 2,
      D: 0,
      E: 1,
      F: 0,
      G: 0,
      A: 0,
      B: 0
    });
    expect(calculateEffectiveCost(state.players[0], card)).toEqual({ C: 1, E: 0, G: 1 });
  });

  it("never reduces a discounted cost below zero", () => {
    const state = createInitialGameState({ shuffle: false });
    state.players[0].builtCards = [
      ownedBonus("C", "c-1"),
      ownedBonus("C", "c-2")
    ];
    const card = { ...ALL_CARDS[0], cost: { C: 1 } };

    expect(calculateEffectiveCost(state.players[0], card)).toEqual({ C: 0 });
  });

  it("lets GOLD_REST cover missing note costs", () => {
    const state = createInitialGameState({ shuffle: false });
    const card = { ...ALL_CARDS[0], cost: { C: 1, E: 1, G: 1 } };
    state.players[0].tokens = {
      C: 1,
      D: 0,
      E: 0,
      F: 0,
      G: 1,
      A: 0,
      B: 0,
      GOLD_REST: 1
    };

    expect(canAffordCard(state.players[0], card).canBuild).toBe(true);
  });

  it("replenishes the market after building a visible card", () => {
    const state = createInitialGameState({ shuffle: false });
    const card = tierCard(state, 1, "C Major");
    state.players[0].tokens = {
      C: 1,
      D: 0,
      E: 1,
      F: 0,
      G: 1,
      A: 0,
      B: 0,
      GOLD_REST: 0
    };

    const result = buildCard(state, card.id, "market");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.players[0].builtCards).toHaveLength(1);
    expect(result.state.market.visibleCards[1]).toHaveLength(4);
    expect(result.state.market.visibleCards[1].some((item) => item.id === card.id)).toBe(false);
  });

  it("removes a built held card from heldCards", () => {
    const state = createInitialGameState({ shuffle: false });
    const card = tierCard(state, 1, "G Major");
    state.players[0].heldCards = [card];
    state.players[0].tokens = {
      C: 0,
      D: 1,
      E: 0,
      F: 0,
      G: 1,
      A: 0,
      B: 1,
      GOLD_REST: 0
    };

    const result = buildCard(state, card.id, "held");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.players[0].heldCards).toHaveLength(0);
    expect(result.state.players[0].builtCards[0].id).toBe(card.id);
  });

  it("limits held cards to 3", () => {
    const state = createInitialGameState({ shuffle: false });
    state.players[0].heldCards = [
      ownedBonus("C", "held-1"),
      ownedBonus("D", "held-2"),
      ownedBonus("E", "held-3")
    ];
    const card = tierCard(state, 1, "F Major");

    const result = holdCard(state, card.id);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("3장");
  });

  it("grants 1 GOLD_REST when holding if one remains", () => {
    const state = createInitialGameState({ shuffle: false });
    const card = tierCard(state, 1, "A minor");

    const result = holdCard(state, card.id);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.players[0].heldCards[0].id).toBe(card.id);
    expect(result.state.players[0].tokens.GOLD_REST).toBe(1);
    expect(result.state.market.tokenPool.GOLD_REST).toBe(4);
  });

  it("automatically awards a maestro when bonus requirements are met", () => {
    const state = createInitialGameState({ shuffle: false });
    const mozart = MAESTRO_TILES.find((tile) => tile.id === "maestro-mozart")!;
    state.market.maestroTiles = [mozart];
    state.players[0].builtCards = [
      ownedBonus("C", "c-1"),
      ownedBonus("C", "c-2"),
      ownedBonus("C", "c-3"),
      ownedBonus("G", "g-1"),
      ownedBonus("G", "g-2")
    ];
    const card = tierCard(state, 1, "F Major");
    state.players[0].tokens = {
      C: 1,
      D: 0,
      E: 0,
      F: 1,
      G: 0,
      A: 1,
      B: 0,
      GOLD_REST: 0
    };

    const result = buildCard(state, card.id, "market");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.players[0].maestroTiles.map((tile) => tile.id)).toContain("maestro-mozart");
    expect(result.state.players[0].score).toBe(card.points + mozart.points);
  });

  it("ends the game when a player reaches 15 or more points", () => {
    const state = createInitialGameState({ shuffle: false });
    const card = tierCard(state, 3, "Tension Release");
    state.players[0].score = 10;
    state.players[0].tokens = {
      C: 2,
      D: 0,
      E: 1,
      F: 1,
      G: 3,
      A: 0,
      B: 1,
      GOLD_REST: 0
    };

    const result = buildCard(state, card.id, "market");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.phase).toBe("gameOver");
    expect(result.state.winnerId).toBe("player-1");
  });
});
