import type { RomajiChunk } from '../types/romaji';
import { ROMAJI_TABLE, N_AMBIGUOUS_PREFIXES } from './romajiTable';

/**
 * ひらがな文字列をローマ字チャンクに分解する。
 * 最長一致（3文字→2文字→1文字）でテーブルを引く。
 * 促音「っ」と「ん」は後処理で文脈に応じたパターンを生成する。
 */
export function parseToChunks(hiragana: string): RomajiChunk[] {
  const rawChunks: RomajiChunk[] = [];
  let i = 0;

  while (i < hiragana.length) {
    let matched = false;
    // 最長一致: 3→2→1
    for (const len of [3, 2, 1]) {
      const substr = hiragana.slice(i, i + len);
      if (ROMAJI_TABLE[substr]) {
        rawChunks.push({
          kana: substr,
          patterns: [...ROMAJI_TABLE[substr]],
        });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // テーブルにない文字はそのまま通す（英数字・記号等）
      const ch = hiragana[i];
      rawChunks.push({ kana: ch, patterns: [ch] });
      i++;
    }
  }

  return postProcess(rawChunks);
}

/**
 * 後処理: 促音「っ」と「ん」のパターンを文脈に応じて調整
 */
function postProcess(chunks: RomajiChunk[]): RomajiChunk[] {
  const result: RomajiChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const next = chunks[i + 1] ?? null;

    if (chunk.kana === 'っ' && next) {
      // 促音: 次のチャンクの先頭子音を重ねるパターンを追加
      const consonants = getLeadingConsonants(next.patterns);
      if (consonants.size > 0) {
        // 次のチャンクの各パターンに子音を前置したパターンを生成
        const combinedPatterns: string[] = [];
        for (const nextPattern of next.patterns) {
          const firstChar = nextPattern[0];
          if (firstChar && !isVowel(firstChar)) {
            combinedPatterns.push(firstChar + nextPattern);
          }
        }
        // 結合チャンクを作成（っ+次のかなを1チャンクとして扱う）
        if (combinedPatterns.length > 0) {
          // 単独入力パターン(xtu/ltu)も残す → 別チャンクとして分離
          // ここでは結合パターンを優先し、単独パターンも許容する
          const allPatterns = [
            ...combinedPatterns,
            // xtu/ltu + 次のチャンクの各パターン
            ...chunk.patterns.flatMap(cp => next.patterns.map(np => cp + np)),
          ];
          result.push({
            kana: chunk.kana + next.kana,
            patterns: dedup(allPatterns),
          });
          i++; // 次のチャンクをスキップ
          continue;
        }
      }
      // 子音が取れなかった場合はそのまま
      result.push(chunk);
    } else if (chunk.kana === 'ん') {
      // 「ん」: 次の文字によって n 単独を許容するか判定
      const patterns = [...chunk.patterns]; // nn, n', xn
      if (next) {
        const nextFirstChars = new Set(next.patterns.map(p => p[0]));
        const isAmbiguous = [...nextFirstChars].some(c => N_AMBIGUOUS_PREFIXES.has(c!));
        if (!isAmbiguous) {
          // 次が子音（na/ni/nu/ne/no/ya/yu/yo/母音/n以外）なら n 単独OK
          patterns.unshift('n');
        }
      } else {
        // 文末なら n 単独OK
        patterns.unshift('n');
      }
      result.push({ kana: chunk.kana, patterns });
    } else {
      result.push(chunk);
    }
  }

  return result;
}

function getLeadingConsonants(patterns: string[]): Set<string> {
  const consonants = new Set<string>();
  for (const p of patterns) {
    if (p[0] && !isVowel(p[0])) {
      consonants.add(p[0]);
    }
  }
  return consonants;
}

function isVowel(ch: string): boolean {
  return 'aiueo'.includes(ch);
}

function dedup(arr: string[]): string[] {
  return [...new Set(arr)];
}
