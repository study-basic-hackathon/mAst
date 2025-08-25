# フロントエンド（React）コンテナのDocker設定

# ベースイメージとしてNode.jsを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ビルドコマンド
RUN npm run build

# アプリケーションの起動コマンド
CMD ["npm", "run", "dev"]
