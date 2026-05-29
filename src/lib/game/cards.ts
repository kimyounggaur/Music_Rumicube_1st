import type { CardTier, ChordCard, Note, TokenCost } from "./types";

function chord(
  id: string,
  tier: CardTier,
  title: string,
  subtitleKo: string,
  category: ChordCard["category"],
  chordSymbol: string,
  notes: Note[],
  cost: TokenCost,
  bonus: Note,
  points: number,
  educationHint: string,
  soundNotes: string[]
): ChordCard {
  return {
    id,
    tier,
    title,
    subtitleKo,
    category,
    chordSymbol,
    notes,
    cost,
    bonus,
    points,
    educationHint,
    soundNotes
  };
}

export const TIER_1_CARDS: ChordCard[] = [
  chord(
    "t1-c-major",
    1,
    "C Major",
    "도 메이저",
    "Triad",
    "C",
    ["C", "E", "G"],
    { C: 1, E: 1, G: 1 },
    "C",
    0,
    "도-미-솔이 만나 가장 기본적인 밝은 장3화음이 됩니다.",
    ["C4", "E4", "G4"]
  ),
  chord(
    "t1-g-major",
    1,
    "G Major",
    "솔 메이저",
    "Triad",
    "G",
    ["G", "B", "D"],
    { G: 1, B: 1, D: 1 },
    "G",
    0,
    "솔-시-레는 다음 화음으로 힘차게 이어지는 밝은 느낌을 만듭니다.",
    ["G3", "B3", "D4"]
  ),
  chord(
    "t1-f-major",
    1,
    "F Major",
    "파 메이저",
    "Triad",
    "F",
    ["F", "A", "C"],
    { F: 1, A: 1, C: 1 },
    "F",
    0,
    "파-라-도는 부드럽고 따뜻한 장3화음입니다.",
    ["F3", "A3", "C4"]
  ),
  chord(
    "t1-a-minor",
    1,
    "A minor",
    "라 마이너",
    "Triad",
    "Am",
    ["A", "C", "E"],
    { A: 1, C: 1, E: 1 },
    "A",
    0,
    "라-도-미는 차분한 느낌의 기본 단3화음입니다.",
    ["A3", "C4", "E4"]
  ),
  chord(
    "t1-d-minor",
    1,
    "D minor",
    "레 마이너",
    "Triad",
    "Dm",
    ["D", "F", "A"],
    { D: 1, F: 1, A: 1 },
    "D",
    0,
    "레-파-라는 다음 화음으로 자연스럽게 걸어가는 단3화음입니다.",
    ["D4", "F4", "A4"]
  ),
  chord(
    "t1-e-minor",
    1,
    "E minor",
    "미 마이너",
    "Triad",
    "Em",
    ["E", "G", "B"],
    { E: 1, G: 1, B: 1 },
    "E",
    0,
    "미-솔-시는 살짝 어두운 색을 더하는 단3화음입니다.",
    ["E4", "G4", "B4"]
  ),
  chord(
    "t1-b-dim",
    1,
    "B diminished",
    "시 디미니시드",
    "Triad",
    "Bdim",
    ["B", "D", "F"],
    { B: 1, D: 1, F: 1 },
    "B",
    1,
    "시-레-파는 긴장감이 강해서 해결될 곳을 찾는 화음입니다.",
    ["B3", "D4", "F4"]
  )
];

const TIER_1_VARIANTS: ChordCard[] = TIER_1_CARDS.flatMap((card, index) => [
  {
    ...card,
    id: `${card.id}-warm`,
    title: `${card.title} Warm`,
    cost: { ...card.cost, [card.bonus]: (card.cost[card.bonus] ?? 0) + (index % 2 === 0 ? 1 : 0) },
    educationHint: `${card.subtitleKo}를 다른 자리바꿈으로 들어도 같은 화음으로 느낄 수 있습니다.`
  },
  {
    ...card,
    id: `${card.id}-light`,
    title: `${card.title} Light`,
    points: card.points,
    educationHint: `${card.subtitleKo}의 핵심음은 ${card.notes.join("-")}입니다.`
  }
]);

export const TIER_2_CARDS: ChordCard[] = [
  chord(
    "t2-cmaj7",
    2,
    "Cmaj7",
    "도 메이저 세븐",
    "7th",
    "Cmaj7",
    ["C", "E", "G", "B"],
    { C: 2, E: 1, G: 1, B: 1 },
    "C",
    2,
    "Cmaj7은 밝은 도 메이저에 시 음을 더해 맑고 넓은 느낌을 냅니다.",
    ["C4", "E4", "G4", "B4"]
  ),
  chord(
    "t2-g7",
    2,
    "G7",
    "솔 도미넌트 세븐",
    "7th",
    "G7",
    ["G", "B", "D", "F"],
    { G: 2, B: 1, D: 1, F: 1 },
    "G",
    2,
    "G7은 C Major로 가고 싶어 하는 긴장감을 만듭니다.",
    ["G3", "B3", "D4", "F4"]
  ),
  chord(
    "t2-am7",
    2,
    "Am7",
    "라 마이너 세븐",
    "7th",
    "Am7",
    ["A", "C", "E", "G"],
    { A: 2, C: 1, E: 1, G: 1 },
    "A",
    2,
    "Am7은 부드러운 단화음에 솔 음을 더해 편안한 색을 만듭니다.",
    ["A3", "C4", "E4", "G4"]
  ),
  chord(
    "t2-dm7",
    2,
    "Dm7",
    "레 마이너 세븐",
    "7th",
    "Dm7",
    ["D", "F", "A", "C"],
    { D: 2, F: 1, A: 1, C: 1 },
    "D",
    2,
    "Dm7은 ii-V-I 진행의 출발점처럼 다음 화음으로 길을 엽니다.",
    ["D4", "F4", "A4", "C5"]
  ),
  chord(
    "t2-fmaj7",
    2,
    "Fmaj7",
    "파 메이저 세븐",
    "7th",
    "Fmaj7",
    ["F", "A", "C", "E"],
    { F: 2, A: 1, C: 1, E: 1 },
    "F",
    2,
    "Fmaj7은 따뜻한 파 메이저에 미 음이 더해져 반짝이는 느낌을 냅니다.",
    ["F3", "A3", "C4", "E4"]
  ),
  chord(
    "t2-bm7b5",
    2,
    "Bm7b5",
    "시 하프 디미니시드",
    "7th",
    "Bm7b5",
    ["B", "D", "F", "A"],
    { B: 2, D: 1, F: 1, A: 1 },
    "B",
    3,
    "Bm7b5는 긴장감을 더 크게 만들어 해결되는 순간을 돋보이게 합니다.",
    ["B3", "D4", "F4", "A4"]
  )
];

export const TIER_3_CARDS: ChordCard[] = [
  chord(
    "t3-ii-v-i-c",
    3,
    "ii-V-I in C",
    "레마이너7-솔7-도메이저7",
    "Progression",
    "Dm7-G7-Cmaj7",
    ["D", "G", "C", "F", "B"],
    { D: 2, G: 2, C: 2, F: 1, B: 1 },
    "C",
    4,
    "ii-V-I는 재즈에서 긴장과 해결을 가장 선명하게 들려주는 진행입니다.",
    ["D4", "F4", "A4", "C5", "G3", "B3", "D4", "F4", "C4", "E4", "G4", "B4"]
  ),
  chord(
    "t3-tension-release",
    3,
    "Tension Release",
    "솔7-도메이저7",
    "Progression",
    "G7-Cmaj7",
    ["G", "C", "B", "F", "E"],
    { G: 3, C: 2, B: 1, F: 1, E: 1 },
    "B",
    5,
    "G7의 긴장이 Cmaj7에서 풀리며 음악이 도착한 느낌을 줍니다.",
    ["G3", "B3", "D4", "F4", "C4", "E4", "G4", "B4"]
  ),
  chord(
    "t3-jazz-cadence",
    3,
    "Jazz Cadence",
    "재즈 종지",
    "Progression",
    "Dm7-G7-Cmaj7",
    ["D", "G", "C", "E", "B"],
    { D: 2, G: 2, C: 2, E: 1, B: 1 },
    "D",
    5,
    "재즈 종지는 화음이 질문하고 대답하는 흐름을 들려줍니다.",
    ["D4", "F4", "A4", "C5", "G3", "B3", "D4", "F4", "C4", "E4", "G4", "B4"]
  ),
  chord(
    "t3-pop-loop",
    3,
    "Pop Loop",
    "팝 루프",
    "Progression",
    "C-G-Am-F",
    ["C", "G", "A", "F", "E"],
    { C: 2, G: 2, A: 2, F: 2, E: 1 },
    "A",
    5,
    "C-G-Am-F는 많은 팝 음악에서 반복되는 친숙한 진행입니다.",
    ["C4", "E4", "G4", "G3", "B3", "D4", "A3", "C4", "E4", "F3", "A3", "C4"]
  ),
  chord(
    "t3-i-v-vi-iv",
    3,
    "I-V-vi-IV",
    "도-솔-라단-파",
    "Progression",
    "C-G-Am-F",
    ["C", "G", "A", "F"],
    { C: 2, G: 2, A: 2, F: 2 },
    "G",
    4,
    "I-V-vi-IV는 안정, 이동, 감정 변화, 귀환을 쉽게 느끼게 해 줍니다.",
    ["C4", "E4", "G4", "G3", "B3", "D4", "A3", "C4", "E4", "F3", "A3", "C4"]
  ),
  chord(
    "t3-circle",
    3,
    "Circle Motion",
    "5도권 움직임",
    "Progression",
    "Dm-G-C",
    ["D", "G", "C", "A", "E"],
    { D: 2, G: 2, C: 2, A: 1, E: 1 },
    "F",
    4,
    "5도권 움직임은 화음이 자연스럽게 다음 자리로 굴러가는 느낌을 줍니다.",
    ["D4", "F4", "A4", "G3", "B3", "D4", "C4", "E4", "G4"]
  )
];

export const ALL_CARDS: ChordCard[] = [
  ...TIER_1_CARDS,
  ...TIER_1_VARIANTS,
  ...TIER_2_CARDS,
  ...TIER_3_CARDS
];

export const CARDS_BY_TIER: Record<CardTier, ChordCard[]> = {
  1: [...TIER_1_CARDS, ...TIER_1_VARIANTS],
  2: TIER_2_CARDS,
  3: TIER_3_CARDS
};
