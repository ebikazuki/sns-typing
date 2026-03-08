import type { FlameThread, GameQuestion } from '../types/phrase';

/**
 * 投稿→リプ3回の繰り返しで出題リストを生成する。
 * 投稿はランダム順で繰り返し、各投稿から3つのリプをランダム選出。
 */
export function generateQuestions(
  threads: FlameThread[],
  rounds: number
): GameQuestion[] {
  const result: GameQuestion[] = [];
  const repliesPerPost = 3;

  for (let i = 0; i < rounds; i++) {
    // 直前と同じ投稿を避ける
    const lastPostId = result.length > 0 ? result[result.length - 1].post.id : null;
    const candidates = threads.filter(t => t.post.id !== lastPostId);
    const pool = candidates.length > 0 ? candidates : threads;
    const thread = pool[Math.floor(Math.random() * pool.length)];

    // リプをシャッフルして3つ選出
    const shuffled = [...thread.replies].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, repliesPerPost);

    for (let j = 0; j < selected.length; j++) {
      result.push({
        post: thread.post,
        reply: selected[j],
        replyIndex: j,
        replyTotal: repliesPerPost,
      });
    }
  }

  return result;
}
