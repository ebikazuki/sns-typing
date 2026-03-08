# SNS炎上タイピング

## プロジェクト概要

SNS の炎上コメントを高速タイピングで投稿する日本語ローマ字タイピングゲーム。
静的サイトとして動作し、バックエンドは不要。Docker で開発・本番環境を統一し、可搬性を確保する。

## 技術スタック

- **フレームワーク**: Vite + React 19 + TypeScript
- **スタイリング**: CSS Modules
- **テスト**: Vitest + React Testing Library
- **リンター/フォーマッター**: ESLint + Prettier
- **パッケージマネージャー**: npm
- **コンテナ**: Docker + Docker Compose
  - 開発: Vite dev server コンテナ（ホットリロード対応）
  - 本番: マルチステージビルド → nginx 配信コンテナ（alpine ベース、メモリ 2GB 制約対応）

## ディレクトリ構造

```
typing/
├── CLAUDE.md
├── Dockerfile             # マルチステージビルド（開発・本番兼用）
├── compose.yaml           # 本番用 Docker Compose
├── compose.dev.yaml       # 開発用オーバーライド
├── nginx.conf             # nginx 設定（軽量化済み）
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   ├── phrase.ts       # FlamePhrase 型定義
│   │   ├── game.ts         # GameScreen, GameResult, ScoreState 等
│   │   └── romaji.ts       # RomajiChunk, InputState, JudgeResult
│   ├── utils/
│   │   ├── romajiTable.ts  # ひらがな→ローマ字変換テーブル
│   │   ├── chunkParser.ts  # ひらがな→チャンク分解
│   │   ├── inputJudge.ts   # キー入力の正誤判定ステートマシン
│   │   ├── displayRomaji.ts # 表示用ローマ字生成
│   │   └── questionGenerator.ts # 出題ロジック
│   ├── data/
│   │   └── flamePhrases.ts # 炎上フレーズデータ
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useTyping.ts
│   │   ├── useScore.ts
│   │   └── useHighScore.ts
│   ├── components/
│   │   ├── TitleScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── GameHeader.tsx
│   │   ├── PhraseCard.tsx  # お題の炎上コメント表示（SNS投稿風）
│   │   ├── TypingArea.tsx  # ひらがな・ローマ字ガイド・入力フィードバック
│   │   └── ResultScreen.tsx
│   └── styles/
│       └── global.css
└── tests/
    ├── chunkParser.test.ts
    └── inputJudge.test.ts
```

## 開発コマンド

### Docker（推奨）

```bash
docker compose -f compose.yaml -f compose.dev.yaml up   # 開発サーバー
docker compose up -d                                      # 本番配信
docker compose down                                       # 停止
```

### ローカル

```bash
npm run dev       # 開発サーバー起動
npm run build     # プロダクションビルド
npm run preview   # ビルドプレビュー
npm run test      # テスト実行
npm run lint      # リント実行
```

## コーディング規約

- コンポーネントは関数コンポーネント + hooks で記述
- 状態管理は React 標準（useState / useReducer / useContext）を使用
- 外部ライブラリは最小限に抑える
- コメントは日本語可

## デプロイ

- VPS（メモリ 2GB）上で `docker compose up -d` により nginx コンテナで本番配信
- マルチステージビルドにより軽量なプロダクションイメージを生成（alpine ベース）
- nginx は worker_processes 1、worker_connections 256 で省メモリ設定

## ゲーム仕様

### コンセプト

SNS 炎上タイピング — 表示された炎上コメント（煽り・毒舌フレーズ）をそのままタイピングして投稿する。
プレイヤーが自ら炎上コメントを書き込む感覚のタイピングゲーム。

### 画面構成

1. **タイトル画面** — ゲーム開始ボタン、ハイスコア表示
2. **ゲーム画面** — SNS 風 UI（炎上コメントをタイピング入力）
3. **リザルト画面** — スコア、投稿数、WPM、正確率、ランク表示

### ゲームフロー

- 制限時間: 60 秒
- 炎上フレーズ（お題）が表示される
- プレイヤーはそのフレーズをローマ字入力でタイピング
- 1 フレーズ完了 → コメント投稿演出 → 次のフレーズへ
- 制限時間終了でリザルト画面へ

### スコアリング

- 基本スコア: 1 正解打鍵ごとに 10 点 × コンボ倍率
- コンボ倍率: 0-9 打 → ×1.0、10-19 打 → ×1.5、20-29 打 → ×2.0、30-39 打 → ×2.5、40+ 打 → ×3.0
- ミス時: コンボリセット（倍率 ×1.0 に戻る）
- フレーズ完了ボーナス: +100 点

### ランク制度

| ランク | スコア     |
|--------|-----------|
| S      | 10000+    |
| A      | 7000-9999 |
| B      | 4000-6999 |
| C      | 2000-3999 |
| D      | 0-1999    |

### フレーズデータ

- 炎上コメント（煽り・毒舌系 SNS ミームフレーズ）を 1 層リストで保持
- 各フレーズ: 表示テキスト（漢字かな交じり）+ ひらがな読み
- ランダム順で出題、直前 3 問と重複回避

### UI/UX

- SNS 風デザイン（ダークモード基調）
- 入力中の文字ハイライト（正解: 緑、ミス: 赤）
- コメント投稿完了時のアニメーション
- e-typing 風の表示要素: ひらがな表示 + ローマ字ガイド + 苦手キー分析（リザルト）

### 技術仕様（ローマ字変換）

- 変換テーブル: `Record<string, string[]>` でひらがな→ローマ字パターン配列
- チャンク分解: ひらがな文字列を最長一致でチャンク分割
- 入力判定: キー入力ごとに有効パターンを絞り込むステートマシン
- 促音「っ」: 次の子音を重ねるパターン + xtu/ltu 単独入力の両方許容
- 「ん」: 次の文字に応じて n 単独許容/不許容を判定
- 拗音: しゃ → sha/sya 等、複数パターン対応

## 作業ルール

- **変更は必ず git でコミットすること**
- コミットメッセージは変更内容が分かるように記述（日本語可）
- **プッシュは作業単位の区切りで行う**（機能完成時、作業中断・終了時など）
