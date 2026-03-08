# 日本語タイピングゲーム

## プロジェクト概要

日本語の文章をローマ字入力でタイピングするWebアプリケーション。
静的サイトとして動作し、バックエンドは不要。

## 技術スタック

- **フレームワーク**: Vite + React 19 + TypeScript
- **スタイリング**: CSS Modules
- **テスト**: Vitest + React Testing Library
- **リンター/フォーマッター**: ESLint + Prettier
- **パッケージマネージャー**: npm

## ディレクトリ構造

```
typing/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
├── src/
│   ├── main.tsx          # エントリーポイント
│   ├── App.tsx            # ルートコンポーネント
│   ├── components/        # UIコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── utils/             # ローマ字変換等のユーティリティ
│   ├── data/              # 問題文データ
│   ├── types/             # TypeScript型定義
│   └── styles/            # グローバルスタイル
└── tests/                 # テストファイル
```

## 開発コマンド

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

- `npm run build` で `dist/` に出力
- VPS 上の nginx で `dist/` を静的ファイルとして配信

## ゲーム仕様

- **入力方式**: ローマ字入力
- **ローマ字パターン**: 複数パターン対応（例: し → si / shi）
- **スコア保存**: localStorage を使用
- **レスポンシブ**: モバイル・デスクトップ両対応
