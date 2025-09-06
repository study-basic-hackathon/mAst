-- 1. Units（単位）テーブル
CREATE TABLE Units (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT '単位名'
) COMMENT = '単位マスタテーブル';

-- 2. Category（カテゴリー）テーブル
CREATE TABLE Category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT 'カテゴリー名'
) COMMENT = 'カテゴリーマスタテーブル';

-- 3. Category_Units（中間テーブル：カテゴリ-単位）
CREATE TABLE Category_Units (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    c_id BIGINT NOT NULL COMMENT 'カテゴリーID',
    u_id BIGINT NOT NULL COMMENT 'ユニットID',
    FOREIGN KEY (c_id) REFERENCES Category(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (u_id) REFERENCES Units(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_category_unit (c_id, u_id)
) COMMENT = 'カテゴリーと単位の中間テーブル';

-- 4. Parts（部品）テーブル
CREATE TABLE Parts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    c_id BIGINT NOT NULL COMMENT 'カテゴリーID',
    p_num BIGINT NOT NULL UNIQUE COMMENT '型番',
    p_name VARCHAR(255) NOT NULL COMMENT '部品名',
    FOREIGN KEY (c_id) REFERENCES Category(id) ON DELETE RESTRICT ON UPDATE CASCADE
) COMMENT = '部品マスタテーブル';

-- 5. Inventory（在庫）テーブル
CREATE TABLE Inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parts_id BIGINT NOT NULL COMMENT '部品ID',
    quantity BIGINT NOT NULL DEFAULT 0 COMMENT '数量',
    FOREIGN KEY (parts_id) REFERENCES Parts(id) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = '在庫管理テーブル';

-- インデックス作成（パフォーマンス向上のため）
CREATE INDEX idx_category_units_c_id ON Category_Units(c_id);
CREATE INDEX idx_category_units_u_id ON Category_Units(u_id);
CREATE INDEX idx_parts_c_id ON Parts(c_id);
CREATE INDEX idx_parts_p_num ON Parts(p_num);
CREATE INDEX idx_inventory_parts_id ON Inventory(parts_id);