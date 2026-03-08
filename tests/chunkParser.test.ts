import { describe, it, expect } from 'vitest';
import { parseToChunks } from '../src/utils/chunkParser';

describe('parseToChunks', () => {
  it('基本的なひらがなをチャンク分解できる', () => {
    const chunks = parseToChunks('あいう');
    expect(chunks).toHaveLength(3);
    expect(chunks[0].kana).toBe('あ');
    expect(chunks[0].patterns).toContain('a');
    expect(chunks[1].kana).toBe('い');
    expect(chunks[2].kana).toBe('う');
  });

  it('拗音を最長一致で分解する', () => {
    const chunks = parseToChunks('しゃかい');
    expect(chunks[0].kana).toBe('しゃ');
    expect(chunks[0].patterns).toContain('sha');
    expect(chunks[0].patterns).toContain('sya');
    expect(chunks[1].kana).toBe('か');
    expect(chunks[2].kana).toBe('い');
  });

  it('促音「っ」を次のチャンクと結合する', () => {
    const chunks = parseToChunks('かった');
    expect(chunks).toHaveLength(2); // か, った
    expect(chunks[1].kana).toBe('った');
    expect(chunks[1].patterns).toContain('tta');
    expect(chunks[1].patterns.some(p => p.includes('xtu') || p.includes('ltu'))).toBe(true);
  });

  it('「ん」の後に子音が来る場合 n 単独を許容する', () => {
    const chunks = parseToChunks('かんぱ');
    const nChunk = chunks.find(c => c.kana === 'ん')!;
    expect(nChunk.patterns).toContain('n');
    expect(nChunk.patterns).toContain('nn');
  });

  it('「ん」の後に母音が来る場合 n 単独を不許容', () => {
    const chunks = parseToChunks('はんい');
    const nChunk = chunks.find(c => c.kana === 'ん')!;
    expect(nChunk.patterns).not.toContain('n');
    expect(nChunk.patterns).toContain('nn');
  });

  it('「ん」の後にな行が来る場合 n 単独を不許容', () => {
    const chunks = parseToChunks('かんな');
    const nChunk = chunks.find(c => c.kana === 'ん')!;
    expect(nChunk.patterns).not.toContain('n');
  });

  it('文末の「ん」は n 単独を許容する', () => {
    const chunks = parseToChunks('にほん');
    const nChunk = chunks[chunks.length - 1];
    expect(nChunk.kana).toBe('ん');
    expect(nChunk.patterns).toContain('n');
  });

  it('記号を含むフレーズを処理できる', () => {
    const chunks = parseToChunks('うそ！');
    expect(chunks).toHaveLength(3);
    expect(chunks[2].kana).toBe('！');
    expect(chunks[2].patterns).toContain('!');
  });

  it('「し」に複数パターンがある', () => {
    const chunks = parseToChunks('し');
    expect(chunks[0].patterns).toContain('si');
    expect(chunks[0].patterns).toContain('shi');
  });
});
