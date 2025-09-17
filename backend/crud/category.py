import mysql.connector
from typing import List
import schemas

def get_all(db: mysql.connector.MySQLConnection) -> List[schemas.Category]:
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM Category")
    categories = cursor.fetchall()
    cursor.close()
    return [schemas.Category(**category) for category in categories]
