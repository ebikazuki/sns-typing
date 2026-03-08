/** 炎上投稿（表示のみ、タイピング不要） */
export interface FlamePost {
  id: string;
  display: string;
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
  replyIndex: number;
  replyTotal: number;
}
