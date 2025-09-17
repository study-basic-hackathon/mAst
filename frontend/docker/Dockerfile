# フロントエンド（React）コンテナの本番用Docker設定

# --- ビルドステージ ---
FROM node:current-alpine3.22 AS build

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# --- プロダクションステージ ---
FROM nginx:stable-alpine

# ビルドステージからビルド成果物をコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxのデフォルトポートを公開
EXPOSE 80

# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]
