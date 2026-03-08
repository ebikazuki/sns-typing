import type { InputState, RomajiChunk } from '../types/romaji';

/** 全チャンクの代表パターン(先頭)を結合した表示用ローマ字 */
export function getDisplayRomaji(chunks: RomajiChunk[]): string {
  return chunks.map(c => c.patterns[0]).join('');
}

/** 入力状態に基づいて、入力済み / 現在入力中 / 未入力のセグメントを返す */
export function getDisplaySegments(state: InputState): {
  typed: string;
  current: string;
  remaining: string;
} {
  const { chunks, currentChunkIndex, currentInput, validPatterns } = state;

  // 入力済みチャンクの代表パターンを結合
  const typed = chunks.slice(0, currentChunkIndex).map(c => c.patterns[0]).join('');

  // 現在のチャンクの表示: 入力済み部分 + 残りの最短パターン
  let current = '';
  let remaining = '';

  if (currentChunkIndex < chunks.length) {
    current = currentInput;
    // 有効パターンの中で最短のものの残り部分を表示
    if (validPatterns.length > 0) {
      const shortest = validPatterns.reduce((a, b) => a.length <= b.length ? a : b);
      remaining = shortest.slice(currentInput.length);
    }

    // 未入力チャンクの代表パターン
    const futureChunks = chunks.slice(currentChunkIndex + 1);
    remaining += futureChunks.map(c => c.patterns[0]).join('');
  }

  return { typed, current, remaining };
}

/** ひらがなの進捗を返す */
export function getKanaProgress(state: InputState): {
  completed: string;
  remaining: string;
} {
  const { chunks, currentChunkIndex } = state;
  const completed = chunks.slice(0, currentChunkIndex).map(c => c.kana).join('');
  const remaining = chunks.slice(currentChunkIndex).map(c => c.kana).join('');
  return { completed, remaining };
}
