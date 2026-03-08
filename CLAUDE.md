# 日本語タイピングゲーム

## プロジェクト概要

日本語の文章をローマ字入力でタイピングするWebアプリケーション。
静的サイトとして動作し、バックエンドは不要。Dockerで開発・本番環境を統一し、可搬性を確保する。

## 技術スタック

- **フレームワーク**: Vite + React 19 + TypeScript
- **スタイリング**: CSS Modules
- **テスト**: Vitest + React Testing Library
- **リンター/フォーマッター**: ESLint + Prettier
- **パッケージマネージャー**: npm
- **コンテナ**: Docker + Docker Compose
  - 開発: Vite dev server コンテナ（ホットリロード対応）
  - 本番: マルチステージビルド → nginx 配信コンテナ

## ディレクトリ構造

```
typing/
├── CLAUDE.md
├── Dockerfile             # マルチステージビルド（開発・本番兼用）
├── compose.yaml           # 本番用 Docker Compose
├── compose.dev.yaml       # 開発用オーバーライド
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
├── src/
│   ├── main.tsx            # エントリーポイント
│   ├── App.tsx             # ルートコンポーネント
│   ├── components/         # UIコンポーネント
│   ├── hooks/              # カスタムフック
│   ├── utils/              # ローマ字変換等のユーティリティ
│   ├── data/               # 問題文データ
│   ├── types/              # TypeScript型定義
│   └── styles/             # グローバルスタイル
└── tests/                  # テストファイル
```

## 開発コマンド

### Docker（推奨）

```bash
# 開発サーバー起動（ホットリロード対応）
docker compose -f compose.yaml -f compose.dev.yaml up

# 本番ビルド＆配信
docker compose up

# コンテナ停止
docker compose down
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

- VPS 上で `docker compose up -d` により nginx コンテナで本番配信
- マルチステージビルドにより軽量なプロダクションイメージを生成

## ゲーム仕様

- **入力方式**: ローマ字入力
- **ローマ字パターン**: 複数パターン対応（例: し → si / shi）
- **スコア保存**: localStorage を使用
- **レスポンシブ**: モバイル・デスクトップ両対応

## 作業ルール

- **変更は必ず git でコミットすること**
- コミットメッセージは変更内容が分かるように記述（日本語可）
