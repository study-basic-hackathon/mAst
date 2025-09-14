# mAst

## 開発環境の構築と起動

1. ターミナルを開き、`docker-compose.yml`があるディレクトリに移動
2. 以下のコマンドを実行して、コンテナをビルド・起動します。
```bash
docker compose up --build -d
```

### アクセス情報
- Reactフロントエンド: `http://localhost:5173/`
- FastAPIバックエンド: `http://localhost:8000/`
- FastAPIからDBへのアクセス例: `http://localhost:8000/db`
- MySQLサーバー: `localhost:3306` (SQLクライアントからアクセス可能)

## テストの実行

1. ターミナルを開き、プロジェクトのルートディレクトリに移動
2. 以下のコマンドを実行して、テスト用のコンテナを起動し、テストを実行します。
```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```
このコマンドは、テストが完了すると自動的にコンテナを停止・削除します。

### テスト用データベース
- MySQLサーバー (テスト用): `localhost:3307`
