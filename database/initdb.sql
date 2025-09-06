-- MySQLの初期化スクリプト
-- データベースが起動時に実行されます

-- テーブルが存在しない場合に作成する。

-- まず参照されるテーブルを作成
CREATE TABLE IF NOT EXISTS Category (
    c_id INT PRIMARY KEY AUTO_INCREMENT,
    c_name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Unit (
    u_id INT PRIMARY KEY AUTO_INCREMENT,
    u_name VARCHAR(20) NOT NULL
);

-- 次に中間テーブルを作成
CREATE TABLE IF NOT EXISTS Category_Unit (
    ctu_id INT PRIMARY KEY AUTO_INCREMENT,
    c_id INT NOT NULL,
    u_id INT NOT NULL,
    FOREIGN KEY (c_id) REFERENCES Category(c_id),
    FOREIGN KEY (u_id) REFERENCES Unit(u_id)
);

CREATE TABLE IF NOT EXISTS Part (
    p_id INT PRIMARY KEY AUTO_INCREMENT,
    c_id INT NOT NULL,
    p_name VARCHAR(20) NOT NULL,
    p_num VARCHAR(20),
    FOREIGN KEY (c_id) REFERENCES Category(c_id)
);

CREATE TABLE IF NOT EXISTS Inventory (
    i_id INT PRIMARY KEY AUTO_INCREMENT,
    p_id INT NOT NULL,
    FOREIGN KEY (p_id) REFERENCES Part(p_id)
);

-- データが重複しないように、一度削除して再挿入する
-- 外部キー制約を一時的に無効化
SET FOREIGN_KEY_CHECKS = 0;

-- 全テーブルをTRUNCATE
TRUNCATE TABLE Inventory;
TRUNCATE TABLE Part;
TRUNCATE TABLE Category_Unit;
TRUNCATE TABLE Category;
TRUNCATE TABLE Unit;

-- 外部キー制約を再有効化
SET FOREIGN_KEY_CHECKS = 1;

-- カテゴリーデータの挿入
INSERT INTO Category (c_name) VALUES 
('抵抗器'),
('コンデンサ'),
('トランジスタ'),
('IC'),
('コネクタ'),
('スイッチ'),
('LED'),
('センサー'),
('水晶振動子'),
('変圧器');

-- 単位データの挿入
INSERT INTO Unit (u_name) VALUES 
('個'),
('本'),
('セット'),
('パック'),
('m'),
('mm'),
('Ω'),
('F'),
('V'),
('A');

-- カテゴリーと単位の関係を設定
INSERT INTO Category_Unit (c_id, u_id) VALUES 
-- 抵抗器: 個、本、Ω
(1, 1), (1, 2), (1, 7),
-- コンデンサ: 個、F
(2, 1), (2, 8),
-- トランジスタ: 個、本
(3, 1), (3, 2),
-- IC: 個、本
(4, 1), (4, 2),
-- コネクタ: 個、本、セット
(5, 1), (5, 2), (5, 3),
-- スイッチ: 個、本
(6, 1), (6, 2),
-- LED: 個、本
(7, 1), (7, 2),
-- センサー: 個、本
(8, 1), (8, 2),
-- 水晶振動子: 個、本
(9, 1), (9, 2),
-- 変圧器: 個、本
(10, 1), (10, 2);

-- 電子部品データの挿入
INSERT INTO Part (c_id, p_name, p_num) VALUES 
-- 抵抗器
(1, '炭素抵抗1kΩ', 'R001'),
(1, '金属抵抗10kΩ', 'R002'),
-- コンデンサ
(2, 'セラミック100pF', 'C001'),
(2, '電解100μF', 'C002'),
-- トランジスタ
(3, 'NPN 2SC1815', 'Q001'),
(3, 'PNP 2SA1015', 'Q002'),
-- IC
(4, 'オペアンプLM358', 'IC001'),
(4, 'マイコンATmega', 'IC002'),
-- コネクタ
(5, 'ピンヘッダ40P', 'CN001'),
(5, 'USBコネクタA', 'CN002');

-- 在庫データの挿入
INSERT INTO Inventory (p_id) VALUES 
(1), (1), (1), -- 炭素皮膜抵抗 3個
(2), (2), -- 金属皮膜抵抗 2個
(3), (3), (3), (3), -- セラミックコンデンサ 4個
(4), (4), -- 電解コンデンサ 2個
(5), (5), (5), -- NPNトランジスタ 3個
(6), (6), -- PNPトランジスタ 2個
(7), (7), (7), (7), (7), -- オペアンプ 5個
(8), (8), (8), -- マイコン 3個
(9), (9), (9), (9), (9), (9), -- ピンヘッダ 6個
(10), (10), (10); -- USBコネクタ 3個

