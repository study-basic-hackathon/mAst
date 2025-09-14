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
