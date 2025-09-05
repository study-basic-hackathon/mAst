-- MySQLの初期化スクリプト
-- データベースが起動時に実行されます

-- `messages`テーブルが存在しない場合、作成する
-- CREATE TABLE IF NOT EXISTS messages (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     message VARCHAR(255) NOT NULL
-- );

-- データが重複しないように、一度削除して再挿入する
-- TRUNCATE TABLE messages;
-- INSERT INTO messages (message) VALUES ('Hello from MySQL!');

