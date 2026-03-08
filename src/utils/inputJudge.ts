import type { InputState, JudgeResult, RomajiChunk } from '../types/romaji';

export function createInputState(chunks: RomajiChunk[]): InputState {
  return {
    chunks,
    currentChunkIndex: 0,
    currentInput: '',
    validPatterns: chunks.length > 0 ? [...chunks[0].patterns] : [],
    totalCorrect: 0,
    totalMiss: 0,
    missedKeys: {},
  };
}

/**
 * キー入力を判定し、新しい状態と判定結果を返す。
 * state は immutable として扱い、新しいオブジェクトを返す。
 */
export function judgeKeyPress(state: InputState, key: string): [InputState, JudgeResult] {
  if (state.currentChunkIndex >= state.chunks.length) {
    return [state, { type: 'miss' }];
  }

  const candidate = state.currentInput + key;

  // 候補文字列を prefix として持つパターンを絞り込み
  const remaining = state.validPatterns.filter(p => p.startsWith(candidate));

  if (remaining.length === 0) {
    // ミス
    const newMissedKeys = { ...state.missedKeys };
    newMissedKeys[key] = (newMissedKeys[key] || 0) + 1;
    return [
      { ...state, totalMiss: state.totalMiss + 1, missedKeys: newMissedKeys },
      { type: 'miss' },
    ];
  }

  // 正解（少なくとも1つのパターンが prefix 一致）
  const exactMatch = remaining.some(p => p === candidate);

  if (exactMatch) {
    // チャンク完了
    const nextIndex = state.currentChunkIndex + 1;
    const phraseCompleted = nextIndex >= state.chunks.length;
    const nextChunk = state.chunks[nextIndex];

    return [
      {
        ...state,
        currentChunkIndex: nextIndex,
        currentInput: '',
        validPatterns: nextChunk ? [...nextChunk.patterns] : [],
        totalCorrect: state.totalCorrect + 1,
      },
      { type: 'correct', completed: true, phraseCompleted },
    ];
  }

  // prefix 一致のみ（チャンク未完了）
  return [
    {
      ...state,
      currentInput: candidate,
      validPatterns: remaining,
      totalCorrect: state.totalCorrect + 1,
    },
    { type: 'correct', completed: false, phraseCompleted: false },
  ];
}
