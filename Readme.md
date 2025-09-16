# mAst

## 事前準備

1. `.env_template`をコピーして、`docker-compose.yml`があるディレクトリに`.env`を作成する
```
# .env_template
# <>内の環境変数を設定する
MYSQL_USER=<DBログインユーザ>
MYSQL_PASSWORD=<DBユーザパスワード>
MYSQL_DATABASE=<データベース名>
MYSQL_ROOT_PASSWORD=<DBルートパスワード>
```

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
