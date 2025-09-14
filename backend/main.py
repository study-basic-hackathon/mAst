import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import mysql.connector

# .envファイルを読み込む
load_dotenv()

app = FastAPI()

# MySQL接続設定
DB_HOST = os.getenv("MYSQL_HOST", "db")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "mast2509") # docker-compose.ymlで設定したパスワード
DB_NAME = os.getenv("MYSQL_DATABASE", "mast") # docker-compose.ymlで設定したデータベース名

# データベース接続関数
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# リクエストボディの型を定義
class InventoryUpdate(BaseModel):
    quantity: int

class BatchInventoryUpdateItem(BaseModel):
    id: int
    quantity: int

# 在庫一括更新エンドポイント
@app.put("/inventory/batch")
def update_batch_inventory(items: List[BatchInventoryUpdateItem]):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor()
        conn.start_transaction()
        
        update_query = "UPDATE Inventory SET quantity = %s WHERE id = %s"
        
        for item in items:
            if item.quantity < 0:
                raise HTTPException(status_code=400, detail=f"Quantity for item {item.id} cannot be negative")
            cursor.execute(update_query, (item.quantity, item.id))
        
        conn.commit()
        return {"message": "Inventory updated successfully"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except HTTPException as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# 在庫更新エンドポイント
@app.put("/inventory/{inventory_id}")
def update_inventory(inventory_id: int, item: InventoryUpdate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor()
        # 在庫数量が0未満にならないようにチェック
        if item.quantity < 0:
            raise HTTPException(status_code=400, detail="Quantity cannot be negative")
            
        # UPDATEクエリの実行
        query = "UPDATE Inventory SET quantity = %s WHERE id = %s"
        cursor.execute(query, (item.quantity, inventory_id))
        
        # 変更がなかった場合（IDが存在しないなど）
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
            
        conn.commit()
        
        return {"message": "Inventory updated successfully", "inventory_id": inventory_id, "new_quantity": item.quantity}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    finally:
        cursor.close()
        conn.close()

@app.get("/parts")
def get_parts_data():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT
                p.id,
                i.id as inventoryId,
                p.p_name AS title,
                c.name AS category,
                i.quantity
            FROM Parts p
            JOIN Inventory i ON p.id = i.parts_id
            JOIN Category c ON p.c_id = c.id
        """
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.delete("/parts/{parts_id}")
def delete_part(parts_id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor()
        # DELETEクエリの実行 (Partsテーブルから削除)
        # ON DELETE CASCADEにより、関連するInventoryレコードも削除される
        query = "DELETE FROM Parts WHERE id = %s"
        cursor.execute(query, (parts_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Part not found")
            
        conn.commit()
        
        return {"message": "Part deleted successfully", "parts_id": parts_id}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    finally:
        cursor.close()
        conn.close()
