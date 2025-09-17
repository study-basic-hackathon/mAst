import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import mysql.connector

# .envファイルを読み込む
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 5173からのアクセスを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL接続設定
DB_HOST = os.getenv("MYSQL_HOST", "db")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "mast2509")
DB_NAME = os.getenv("MYSQL_DATABASE", "mast")

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

# ルートエンドポイント
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

# データベース接続確認エンドポイント
@app.get("/db")
def get_db_data():
    conn = get_db_connection()
    if conn is None:
        return {"db_message": "Failed to connect to the database."}

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT message FROM messages WHERE id = 1")
        result = cursor.fetchone()
        if result:
            db_message = result[0]
            return {"db_message": db_message}
        else:
            return {"db_message": "No data found in the database."}
    except mysql.connector.Error as e:
        return {"db_message": f"Database query error: {e}"}
    finally:
        conn.close()

# 部品検索エンドポイント
@app.get("/parts")
def get_parts():
    conn = get_db_connection()
    if conn is None:
        return {"message": "DB接続エラーです"}

    try:
        cursor = conn.cursor()
        
        # 部品情報を取得するクエリ
        # Part, Category, Inventoryテーブルを結合して必要な情報を取得
        query = """
            SELECT 
                p.p_name as name,
                c.c_name as category,
                COUNT(i.p_id) as quantity
            FROM Part p
            JOIN Category c ON p.c_id = c.c_id
            LEFT JOIN Inventory i ON p.p_id = i.p_id
            GROUP BY p.p_id, p.p_name, c.c_name
            ORDER BY p.p_id ASC
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        # データが0件の場合
        if not results:
            return {"message": "登録されている部品はありません"}
        
        # レスポンス用のリストを作成
        parts_list = []
        for row in results:
            part = {
                "name": row[0],
                "category": row[1], 
                "imageUrl": "https://placehold.jp/",
                "quantity": int(row[2])
            }
            parts_list.append(part)
        
        return parts_list
        
    except mysql.connector.Error as e:
        print(f"Database query error: {e}")
        return {"message": "DB接続エラーです"}
    finally:
        if conn:
            conn.close()