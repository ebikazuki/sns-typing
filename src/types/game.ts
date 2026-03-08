export type GameScreen = 'title' | 'game' | 'result';

export type GameRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface ComboState {
  current: number;
  max: number;
  multiplier: number;
}

export interface ScoreState {
  score: number;
  combo: ComboState;
  correctCount: number;
  missCount: number;
  phraseCount: number;
}

export interface GameResult {
  score: number;
  correctCount: number;
  missCount: number;
  phraseCount: number;
  maxCombo: number;
  wpm: number;
  accuracy: number;
  rank: GameRank;
  /** キーごとのミス回数 */
  missedKeys: Record<string, number>;
}

export function getComboMultiplier(combo: number): number {
  if (combo >= 40) return 3.0;
  if (combo >= 30) return 2.5;
  if (combo >= 20) return 2.0;
  if (combo >= 10) return 1.5;
  return 1.0;
}

export function getRank(score: number): GameRank {
  if (score >= 10000) return 'S';
  if (score >= 7000) return 'A';
  if (score >= 4000) return 'B';
  if (score >= 2000) return 'C';
  return 'D';
}
