export type Difficulty = 'ROOKIE' | 'PRO' | 'LEGEND';

const baseChallenge: Record<Difficulty, number> = { ROOKIE: 30, PRO: 45, LEGEND: 62 };

export function opponentChallenge(difficulty: Difficulty, round: number) {
  return baseChallenge[difficulty] + Math.max(0, round - 1) * 1.15;
}
