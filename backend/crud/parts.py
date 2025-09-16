import mysql.connector

def get_all(db: mysql.connector.MySQLConnection):
    query = """
        SELECT
            p.id,
            i.id as inventoryId,
            p.p_name AS title,
            c.name AS category,
            i.quantity,
            COALESCE(p.imageUrl, '') AS imageUrl
        FROM Parts p
        JOIN Inventory i ON p.id = i.parts_id
        JOIN Category c ON p.c_id = c.id
    """
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    db.commit()
    return result

def delete_by_id(db: mysql.connector.MySQLConnection, part_id: int):
    query = "DELETE FROM Parts WHERE id = %s"
    cursor = db.cursor()
    cursor.execute(query, (part_id,))
    db.commit()
    rowcount = cursor.rowcount
    cursor.close()
    return rowcount

def update_image_url(db: mysql.connector.MySQLConnection, part_id: int, image_url: str):
    query = "UPDATE Parts SET imageUrl = %s WHERE id = %s"
    cursor = db.cursor()
    cursor.execute(query, (image_url, part_id))
    db.commit()
    rowcount = cursor.rowcount
    cursor.close()
    return rowcount

def create(db: mysql.connector.MySQLConnection, title: str, category_id: int, quantity: int):
    cursor = db.cursor(dictionary=True)
    
    # Partsテーブルに挿入
    cursor.execute("INSERT INTO Parts (p_name, c_id) VALUES (%s, %s)", (title, category_id))
    parts_id = cursor.lastrowid

    # Inventoryテーブルに挿入
    cursor.execute("INSERT INTO Inventory (parts_id, quantity) VALUES (%s, %s)", (parts_id, quantity))
    inventory_id = cursor.lastrowid
    
    db.commit()

    # 作成された部品情報を取得して返す
    query = """
        SELECT
            p.id,
            i.id as inventoryId,
            p.p_name AS title,
            c.name AS category,
            i.quantity,
            COALESCE(p.imageUrl, '') AS imageUrl
        FROM Parts p
        JOIN Inventory i ON p.id = i.parts_id
        JOIN Category c ON p.c_id = c.id
        WHERE p.id = %s
    """
    cursor.execute(query, (parts_id,))
    created_part = cursor.fetchone()
    
    cursor.close()
    
    return created_part
