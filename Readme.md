# mAst

## 概要

電子部品を効率的に管理するためのWebアプリケーションです。

## 主な使用技術

### バックエンド
- Python
- FastAPI
- Uvicorn
- MySQL Connector for Python
- pytest

### フロントエンド
- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

### データベース
- MySQL

### インフラ
- Docker

## 開発環境の構築と起動

### 事前準備

1.  `.env_template` をコピーして、プロジェクトのルートディレクトリに `.env` ファイルを作成し、環境変数を設定します。
    ```
    # .env_template
    # <>内の環境変数を設定する
    MYSQL_USER=<DBログインユーザ>
    MYSQL_PASSWORD=<DBユーザパスワード>
    MYSQL_DATABASE=<データベース名>
    MYSQL_ROOT_PASSWORD=<DBルートパスワード>
    ```

### 起動

1.  ターミナルを開き、プロジェクトのルートディレクトリに移動します。
2.  以下のコマンドを実行して、コンテナをビルドし、バックグラウンドで起動します。
    ```bash
    docker compose up --build -d
    ```
    *   初回起動時や `Dockerfile` に変更があった場合は `--build` オプションが必要です。
    *   2回目以降でビルドが不要な場合は `docker compose up -d` で起動できます。

### アクセス情報

-   Reactフロントエンド: `http://localhost:5173/`
-   FastAPIバックエンド: `http://localhost:8000/docs`
-   MySQLサーバー: `localhost:3306` (SQLクライアントからアクセス可能)

### ログの確認

各サービスのログは以下のコマンドで確認できます。
```bash
# すべてのサービスのログをリアルタイムで表示
docker compose logs -f

# 特定のサービス（例: backend）のログを表示
docker compose logs -f backend
```

### 停止

コンテナを停止するには、以下のコマンドを実行します。
```bash
docker compose down
```
*   データベースのデータなどを完全に削除したい場合は `docker compose down -v` を実行してください。

## テストの実行

1. ターミナルを開き、プロジェクトのルートディレクトリに移動
2. 以下のコマンドを実行して、テスト用のコンテナを起動し、テストを実行します。
```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```
このコマンドは、テストが完了すると自動的にコンテナを停止・削除します。

### テスト用データベース
- MySQLサーバー (テスト用): `localhost:3307`
