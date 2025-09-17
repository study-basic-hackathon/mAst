import mysql.connector
from typing import List
import schemas

def update_item(db: mysql.connector.MySQLConnection, inventory_id: int, quantity: int):
    query = "UPDATE Inventory SET quantity = %s WHERE id = %s"
    cursor = db.cursor()
    cursor.execute(query, (quantity, inventory_id))
    db.commit()
    rowcount = cursor.rowcount
    cursor.close()
    return rowcount

def update_batch_items(db: mysql.connector.MySQLConnection, items: List[schemas.BatchInventoryUpdateItem]):
    query = "UPDATE Inventory SET quantity = %s WHERE id = %s"
    cursor = db.cursor()
    try:
        db.start_transaction()
        for item in items:
            if item.quantity < 0:
                raise ValueError(f"Quantity for item {item.id} cannot be negative")
            cursor.execute(query, (item.quantity, item.id))
        db.commit()
    except (mysql.connector.Error, ValueError) as e:
        db.rollback()
        raise e
    finally:
        cursor.close()
