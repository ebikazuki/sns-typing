import type { FlamePhrase } from '../types/phrase';

/**
 * フレーズリストからランダム順で出題リストを生成する。
 * 直前 avoidLast 問と重複しないように選択する。
 */
export function generateQuestions(
  phrases: FlamePhrase[],
  count: number,
  avoidLast: number = 3
): FlamePhrase[] {
  const result: FlamePhrase[] = [];
  const available = [...phrases];

  for (let i = 0; i < count; i++) {
    const recentIds = result.slice(-avoidLast).map(p => p.id);
    const candidates = available.filter(p => !recentIds.includes(p.id));
    const pool = candidates.length > 0 ? candidates : available;
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
  }

  return result;
}
