# Freee Line Notifier

freee APIと連携して、指定した情報をLINE通知するサービスです。

## 機能

- freeeからの情報取得
- LINE Messaging APIを使用した通知
- Cloudflare Workersでのサーバーレス実行

## 必要要件

- Node.js 18以上
- pnpm 9.13.2
- Docker (開発環境用)
- Cloudflare アカウント

## セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/Uki884/freee-line-notifier.git
cd freee-line-notifier
```

2. 依存関係のインストール:
```bash
pnpm install
```

3. 環境変数の設定:
   - `.env`ファイルを作成し、必要な環境変数を設定
   - freee APIとLINE Messaging APIの認証情報を設定

## 開発方法

### ローカル開発

1. 開発サーバーの起動:
```bash
pnpm dev
```

2. Cloudflared tunnelの起動（別ターミナルで）:
```bash
cloudflared tunnel --url localhost:8788
```

### コードの品質管理

```bash
# リントの実行
pnpm lint

# フォーマットの実行
pnpm format

# コードチェック
pnpm check
```

## プロジェクト構成

```
.
├── apps/
│   ├── server/    # メインサーバーアプリケーション
│   └── worker/    # Cloudflare Workerアプリケーション
├── packages/      # 共有パッケージ
└── compose.yaml   # Docker Compose設定
```

## デプロイ

```bash
pnpm deploy
```

## ライセンス

[MIT License](LICENSE)