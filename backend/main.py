import os
from fastapi import FastAPI
from dotenv import load_dotenv
import mysql.connector

# .envファイルを読み込む
load_dotenv()

app = FastAPI()

# MySQL接続設定
DB_HOST = os.getenv("MYSQL_HOST", "db")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
DB_NAME = os.getenv("MYSQL_DATABASE", "myappdb")

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
