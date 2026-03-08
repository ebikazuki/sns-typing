export interface RomajiChunk {
  /** 元のひらがな */
  kana: string;
  /** 受理するローマ字パターン */
  patterns: string[];
}

export interface InputState {
  chunks: RomajiChunk[];
  currentChunkIndex: number;
  currentInput: string;
  validPatterns: string[];
  totalCorrect: number;
  totalMiss: number;
  /** キーごとのミス回数 */
  missedKeys: Record<string, number>;
}

export type JudgeResult =
  | { type: 'correct'; completed: boolean; phraseCompleted: boolean }
  | { type: 'miss' };
