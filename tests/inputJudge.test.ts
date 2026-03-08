import { describe, it, expect } from 'vitest';
import { createInputState, judgeKeyPress } from '../src/utils/inputJudge';
import { parseToChunks } from '../src/utils/chunkParser';

function typeSequence(input: string, keys: string) {
  const chunks = parseToChunks(input);
  let state = createInputState(chunks);
  const results = [];
  for (const key of keys) {
    const [newState, result] = judgeKeyPress(state, key);
    state = newState;
    results.push(result);
  }
  return { state, results };
}

describe('inputJudge', () => {
  it('正しい入力を受け付ける', () => {
    const { state, results } = typeSequence('あ', 'a');
    expect(results[0].type).toBe('correct');
    if (results[0].type === 'correct') {
      expect(results[0].phraseCompleted).toBe(true);
    }
    expect(state.totalCorrect).toBe(1);
    expect(state.totalMiss).toBe(0);
  });

  it('ミス入力を検出する', () => {
    const { state, results } = typeSequence('あ', 'x');
    expect(results[0].type).toBe('miss');
    expect(state.totalMiss).toBe(1);
  });

  it('複数文字のチャンクを入力できる', () => {
    const { state, results } = typeSequence('か', 'ka');
    expect(results[0].type).toBe('correct');
    if (results[0].type === 'correct') {
      expect(results[0].completed).toBe(false); // k だけではまだ
    }
    expect(results[1].type).toBe('correct');
    if (results[1].type === 'correct') {
      expect(results[1].completed).toBe(true);
    }
  });

  it('shi で「し」を入力できる', () => {
    const { results } = typeSequence('し', 'shi');
    expect(results.every(r => r.type === 'correct')).toBe(true);
    if (results[2].type === 'correct') {
      expect(results[2].phraseCompleted).toBe(true);
    }
  });

  it('si でも「し」を入力できる', () => {
    const { results } = typeSequence('し', 'si');
    expect(results.every(r => r.type === 'correct')).toBe(true);
  });

  it('促音を子音重ねで入力できる', () => {
    const { results } = typeSequence('かった', 'katta');
    expect(results.every(r => r.type === 'correct')).toBe(true);
  });

  it('フレーズ全体を入力できる', () => {
    const { state, results } = typeSequence('くさ', 'kusa');
    expect(results.every(r => r.type === 'correct')).toBe(true);
    expect(state.currentChunkIndex).toBe(2);
  });

  it('ミスしたキーを記録する', () => {
    const { state } = typeSequence('あ', 'xa');
    expect(state.missedKeys['x']).toBe(1);
  });
});
