/** 炎上投稿（タイピング対象） */
export interface FlamePost {
  id: string;
  display: string;
  kana: string;
}

/** リプフレーズ（タイピング対象） */
export interface FlameReply {
  id: string;
  display: string;
  kana: string;
}

/** 投稿+リプのスレッド */
export interface FlameThread {
  post: FlamePost;
  replies: FlameReply[];
}

/** ゲーム中の1問分 */
export interface GameQuestion {
  post: FlamePost;
  reply: FlameReply;
  phase: 'post' | 'reply';
  replyIndex: number;
  replyTotal: number;
}
