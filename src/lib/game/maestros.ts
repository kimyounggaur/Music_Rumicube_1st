import type { MaestroTile } from "./types";

export const MAESTRO_TILES: MaestroTile[] = [
  {
    id: "maestro-mozart",
    name: "Mozart",
    nameKo: "모차르트",
    points: 3,
    requirement: { C: 3, G: 2 },
    flavorText: "맑은 선율처럼 도와 솔의 중심을 안정적으로 세웁니다."
  },
  {
    id: "maestro-beethoven",
    name: "Beethoven",
    nameKo: "베토벤",
    points: 3,
    requirement: { C: 2, F: 2, G: 2 },
    flavorText: "강한 추진력으로 주요 3화음을 단단히 연결합니다."
  },
  {
    id: "maestro-bach",
    name: "Bach",
    nameKo: "바흐",
    points: 3,
    requirement: { D: 2, G: 2, B: 1 },
    flavorText: "성부가 한 걸음씩 움직이듯 긴장과 해결을 다룹니다."
  },
  {
    id: "maestro-debussy",
    name: "Debussy",
    nameKo: "드뷔시",
    points: 3,
    requirement: { F: 2, A: 2, E: 1 },
    flavorText: "부드러운 색채로 화음의 여운을 길게 남깁니다."
  },
  {
    id: "maestro-chopin",
    name: "Chopin",
    nameKo: "쇼팽",
    points: 3,
    requirement: { A: 3, E: 2 },
    flavorText: "섬세한 단조 색깔과 노래하는 선율을 살립니다."
  },
  {
    id: "maestro-ravel",
    name: "Ravel",
    nameKo: "라벨",
    points: 3,
    requirement: { B: 2, E: 2, F: 1 },
    flavorText: "선명한 색채와 긴장감을 정교하게 배치합니다."
  }
];
