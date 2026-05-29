import { NOTE_META, NOTES } from "./constants";
import type {
  CardTier,
  ChordCard,
  GameState,
  MaestroTile,
  Note,
  PlayerState,
  RuleResult,
  TokenAction,
  TokenCost
} from "./types";
import {
  addLog,
  cloneGameState,
  emptyNoteRecord,
  formatNoteSum,
  formatNotes,
  nextTurn,
  totalTokens
} from "./utils";

interface Affordability {
  canBuild: boolean;
  cost: TokenCost;
  missing: TokenCost;
  goldNeeded: number;
}

export function calculateDiscounts(player: PlayerState): Record<Note, number> {
  const discounts = emptyNoteRecord();
  player.builtCards.forEach((card) => {
    discounts[card.bonus] += 1;
  });
  return discounts;
}

export function calculateEffectiveCost(player: PlayerState, card: ChordCard): TokenCost {
  const discounts = calculateDiscounts(player);
  return Object.fromEntries(
    NOTES.filter((note) => (card.cost[note] ?? 0) > 0).map((note) => [
      note,
      Math.max(0, (card.cost[note] ?? 0) - discounts[note])
    ])
  ) as TokenCost;
}

export function canAffordCard(player: PlayerState, card: ChordCard): Affordability {
  const cost = calculateEffectiveCost(player, card);
  const missing: TokenCost = {};
  let goldNeeded = 0;

  NOTES.forEach((note) => {
    const required = cost[note] ?? 0;
    const shortage = Math.max(0, required - player.tokens[note]);
    if (shortage > 0) {
      missing[note] = shortage;
      goldNeeded += shortage;
    }
  });

  return {
    canBuild: goldNeeded <= player.tokens.GOLD_REST,
    cost,
    missing,
    goldNeeded
  };
}

export function meetsMaestroRequirement(player: PlayerState, tile: MaestroTile): boolean {
  const discounts = calculateDiscounts(player);
  return NOTES.every((note) => discounts[note] >= (tile.requirement[note] ?? 0));
}

export function takeTokens(
  state: GameState,
  selected: Note[],
  action: TokenAction
): RuleResult<GameState> {
  const player = state.players[state.currentPlayerIndex];
  const distinct = new Set(selected);

  if (action === "TAKE_3_DISTINCT") {
    if (selected.length !== 3 || distinct.size !== 3) {
      return { ok: false, error: "서로 다른 음계 토큰 3개를 선택해야 합니다." };
    }
    const unavailable = selected.find((note) => state.market.tokenPool[note] < 1);
    if (unavailable) {
      return { ok: false, error: `${NOTE_META[unavailable].label} 토큰이 풀에 남아 있지 않습니다.` };
    }
  }

  if (action === "TAKE_2_SAME") {
    if (selected.length !== 1) {
      return { ok: false, error: "같은 음계 토큰 1종을 선택해야 합니다." };
    }
    const note = selected[0];
    if (state.market.tokenPool[note] < state.settings.sameTokenRequiresAtLeastInPool) {
      return { ok: false, error: "같은 토큰 2개는 풀에 4개 이상 남아 있을 때만 가져올 수 있습니다." };
    }
  }

  const gainCount = action === "TAKE_2_SAME" ? 2 : 3;
  if (totalTokens(player.tokens) + gainCount > state.settings.maxTokensPerPlayer) {
    return { ok: false, error: "플레이어 토큰 총합은 10개를 넘을 수 없습니다." };
  }

  const next = cloneGameState(state);
  const nextPlayer = next.players[next.currentPlayerIndex];
  const notesToTake = action === "TAKE_2_SAME" ? [selected[0], selected[0]] : selected;
  notesToTake.forEach((note) => {
    nextPlayer.tokens[note] += 1;
    next.market.tokenPool[note] -= 1;
  });

  const message = `${nextPlayer.name}이 ${formatNotes(notesToTake)} 토큰을 가져갔습니다.`;
  addLog(next, nextPlayer, message);
  next.toastMessage = message;
  next.errorMessage = undefined;
  nextTurn(next);
  return { ok: true, state: next, message };
}

function findVisibleCard(state: GameState, cardId: string): { card: ChordCard; tier: CardTier; index: number } | undefined {
  for (const tier of [1, 2, 3] as CardTier[]) {
    const index = state.market.visibleCards[tier].findIndex((card) => card.id === cardId);
    if (index >= 0) {
      return { card: state.market.visibleCards[tier][index], tier, index };
    }
  }
  return undefined;
}

function replenishVisible(state: GameState, tier: CardTier): void {
  const nextCard = state.market.decks[tier].shift();
  if (nextCard) {
    state.market.visibleCards[tier].push(nextCard);
  }
}

function removeVisibleCard(state: GameState, tier: CardTier, index: number): void {
  state.market.visibleCards[tier].splice(index, 1);
  replenishVisible(state, tier);
}

function spendCost(state: GameState, player: PlayerState, affordability: Affordability): void {
  const goldToSpend = affordability.goldNeeded;
  NOTES.forEach((note) => {
    const required = affordability.cost[note] ?? 0;
    const paidNote = Math.min(player.tokens[note], required);
    if (paidNote > 0) {
      player.tokens[note] -= paidNote;
      state.market.tokenPool[note] += paidNote;
    }
  });
  if (goldToSpend > 0) {
    player.tokens.GOLD_REST -= goldToSpend;
    state.market.tokenPool.GOLD_REST += goldToSpend;
  }
}

function awardMaestros(state: GameState, player: PlayerState): MaestroTile[] {
  const awarded: MaestroTile[] = [];
  const remaining: MaestroTile[] = [];
  state.market.maestroTiles.forEach((tile) => {
    if (meetsMaestroRequirement(player, tile)) {
      awarded.push(tile);
      player.maestroTiles.push(tile);
      player.score += tile.points;
      addLog(state, player, `${player.name}이 ${tile.nameKo} 타일을 획득했습니다.`);
    } else {
      remaining.push(tile);
    }
  });
  state.market.maestroTiles = remaining;
  return awarded;
}

export function buildCard(
  state: GameState,
  cardId: string,
  source: "market" | "held"
): RuleResult<GameState> {
  const player = state.players[state.currentPlayerIndex];
  const marketHit = source === "market" ? findVisibleCard(state, cardId) : undefined;
  const heldIndex = source === "held" ? player.heldCards.findIndex((card) => card.id === cardId) : -1;
  const card = source === "market" ? marketHit?.card : player.heldCards[heldIndex];

  if (!card) {
    return { ok: false, error: "빌드할 카드를 찾을 수 없습니다." };
  }

  const affordability = canAffordCard(player, card);
  if (!affordability.canBuild) {
    const missing = NOTES.filter((note) => (affordability.missing[note] ?? 0) > 0)
      .map((note) => `${NOTE_META[note].label} ${affordability.missing[note]}개`)
      .join(", ");
    return {
      ok: false,
      error: missing ? `부족한 음: ${missing}` : "지불할 토큰이 부족합니다."
    };
  }

  const next = cloneGameState(state);
  const nextPlayer = next.players[next.currentPlayerIndex];
  const nextMarketHit = source === "market" ? findVisibleCard(next, cardId) : undefined;
  const nextHeldIndex = source === "held" ? nextPlayer.heldCards.findIndex((item) => item.id === cardId) : -1;
  const nextCard = source === "market" ? nextMarketHit?.card : nextPlayer.heldCards[nextHeldIndex];

  if (!nextCard) {
    return { ok: false, error: "빌드할 카드를 찾을 수 없습니다." };
  }

  spendCost(next, nextPlayer, canAffordCard(nextPlayer, nextCard));

  if (source === "market" && nextMarketHit) {
    removeVisibleCard(next, nextMarketHit.tier, nextMarketHit.index);
  } else if (source === "held") {
    nextPlayer.heldCards.splice(nextHeldIndex, 1);
  }

  nextPlayer.builtCards.push(nextCard);
  nextPlayer.score += nextCard.points;
  const builtMessage = `${nextPlayer.name}이 ${nextCard.title} 카드를 빌드했습니다. ${NOTE_META[nextCard.bonus].label} 할인을 얻었습니다.`;
  addLog(next, nextPlayer, builtMessage);
  const awardedMaestros = awardMaestros(next, nextPlayer);

  if (nextPlayer.score >= next.settings.targetScore) {
    next.phase = "gameOver";
    next.winnerId = nextPlayer.id;
    addLog(next, nextPlayer, `${nextPlayer.name}이 ${nextPlayer.score}점으로 승리했습니다.`);
  } else {
    nextTurn(next);
  }

  next.errorMessage = undefined;
  next.toastMessage = awardedMaestros.length
    ? `${awardedMaestros.map((tile) => tile.nameKo).join(", ")} 타일 획득!`
    : `방금 만든 화음: ${formatNoteSum(nextCard.notes)}`;

  return {
    ok: true,
    state: next,
    message: builtMessage,
    awardedMaestros,
    builtCard: nextCard
  };
}

export function holdCard(state: GameState, cardId: string): RuleResult<GameState> {
  const player = state.players[state.currentPlayerIndex];
  if (player.heldCards.length >= state.settings.maxHeldCards) {
    return { ok: false, error: "보관 카드는 최대 3장까지만 가질 수 있습니다." };
  }

  const marketHit = findVisibleCard(state, cardId);
  if (!marketHit) {
    return { ok: false, error: "보관할 공개 카드를 찾을 수 없습니다." };
  }

  const wouldGainGold = state.market.tokenPool.GOLD_REST > 0 ? 1 : 0;
  if (totalTokens(player.tokens) + wouldGainGold > state.settings.maxTokensPerPlayer) {
    return { ok: false, error: "황금 쉼표를 받으면 토큰이 10개를 넘습니다." };
  }

  const next = cloneGameState(state);
  const nextPlayer = next.players[next.currentPlayerIndex];
  const nextHit = findVisibleCard(next, cardId);
  if (!nextHit) {
    return { ok: false, error: "보관할 공개 카드를 찾을 수 없습니다." };
  }

  removeVisibleCard(next, nextHit.tier, nextHit.index);
  nextPlayer.heldCards.push(nextHit.card);
  if (next.market.tokenPool.GOLD_REST > 0) {
    next.market.tokenPool.GOLD_REST -= 1;
    nextPlayer.tokens.GOLD_REST += 1;
  }

  const message = `${nextPlayer.name}이 ${nextHit.card.title} 카드를 보관했습니다.`;
  addLog(next, nextPlayer, message);
  next.toastMessage = nextPlayer.tokens.GOLD_REST > player.tokens.GOLD_REST
    ? `${message} 황금 쉼표를 1개 받았습니다.`
    : message;
  next.errorMessage = undefined;
  nextTurn(next);
  return { ok: true, state: next, message };
}
