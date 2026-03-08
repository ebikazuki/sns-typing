import type { FlameThread } from '../types/phrase';

export const flameThreads: FlameThread[] = [
  {
    post: { id: 'p1', display: '最近の若者って本読まなすぎじゃない？' },
    replies: [
      { id: 'r1', display: '今日はよく燃えますね', kana: 'きょうはよくもえますね' },
      { id: 'r2', display: 'それってあなたの感想ですよね', kana: 'それってあなたのかんそうですよね' },
      { id: 'r3', display: 'それは違うと思います', kana: 'それはちがうとおもいます' },
      { id: 'r4', display: '論点ずれてますよ', kana: 'ろんてんずれてますよ' },
    ],
  },
  {
    post: { id: 'p2', display: 'AIでプログラマーの仕事は全部なくなると思う' },
    replies: [
      { id: 'r5', display: '情弱ですね', kana: 'じょうじゃくですね' },
      { id: 'r6', display: '文脈を理解してから発言してください', kana: 'ぶんみゃくをりかいしてからはつげんしてください' },
      { id: 'r7', display: 'それは完全に論点が違います', kana: 'それはかんぜんにろんてんがちがいます' },
      { id: 'r8', display: '現場からは以上です', kana: 'げんばからはいじょうです' },
    ],
  },
  {
    post: { id: 'p3', display: '努力できない人は自己責任だと思う' },
    replies: [
      { id: 'r9', display: 'ちょっと何言ってるかわからない', kana: 'ちょっとなにいってるかわからない' },
      { id: 'r10', display: '理解力なさすぎ', kana: 'りかいりょくなさすぎ' },
      { id: 'r11', display: 'タイトルしか読んでないでしょ', kana: 'たいとるしかよんでないでしょ' },
      { id: 'r12', display: 'さっきの発言で炎上してるけど別に間違ってないと思う', kana: 'さっきのはつげんでえんじょうしてるけどべつにまちがってないとおもう' },
    ],
  },
];
