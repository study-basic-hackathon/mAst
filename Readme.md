# mAst

## 最小構成の動作環境構築

1. ターミナルを開き、`docker-compose.yml`があるディレクトリに移動
2. 以下のコマンドを実行
```
docker compose up --build -d
```

reactサーバアクセス：`http://localhost:5173/`

fastapiサーバアクセス：`http://localhost:8000/`

fastapiサーバからDBにアクセス：`http://localhost:8000/db`

mysqlサーバ：`localhost:3306`
※sqlサーバにはsqlクライアントでアクセスできる
