# mAst フロントエンド

このリポジトリは、電子部品管理アプリケーション「mAst」のフロントエンド部分です。
React, TypeScript, Vite を使用して構築されています。

## 主な技術スタック

-   React
-   TypeScript
-   Vite
-   React Router
-   Vitest
-   React Testing Library

## ディレクトリ構成

```
.
├─docker : フロントエンド動作環境のDockerファイル
└─src    : ソースコード
    ├─api      : バックエンドAPIとの通信ロジック
    ├─components : 汎用的なUIコンポーネント
    │  ├─Card   : 部品情報を表示・編集・作成するカードUI
    │  ├─common : アプリケーション全体で使われる共通コンポーネント
    │  └─Modal  : 確認・通知用のモーダルウィンドウ
    ├─hooks    : 状態管理やビジネスロジックをカプセル化したカスタムフック
    ├─pages    : 各ページのコンポーネント
    └─test     : テスト全体の設定ファイル
```

## 開発環境の起動

1.  リポジトリのルートディレクトリでDockerコンテナを起動します。
    ```bash
    docker-compose up -d --build
    ```

2.  `frontend` ディレクトリに移動し、依存関係をインストールします。
    ```bash
    cd frontend
    npm install
    ```

3.  開発サーバーを起動します。
    ```bash
    npm run dev
    ```

## テストの実行

`frontend` ディレクトリ内で以下のコマンドを実行します。

```bash
npm test
```
