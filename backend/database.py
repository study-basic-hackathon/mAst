import os
import sys
import time
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

load_dotenv()

# データベース接続設定
DB_HOST = os.getenv("MYSQL_HOST", "db")
DB_USER = os.getenv("MYSQL_USER", "mast_user")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
DB_NAME = os.getenv("MYSQL_DATABASE", "mast")

# 接続プールの設定
db_config = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
}

# 接続試行の最大回数と待機時間
MAX_RETRIES = 10
RETRY_DELAY = 5

retries = 0
cnx_pool = None
while retries < MAX_RETRIES:
    try:
        # 接続プールを作成
        cnx_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mast_pool",
            pool_size=5,
            **db_config
        )
        print("Database connection pool created successfully.")
        break  # 成功したらループを抜ける
    except mysql.connector.Error as e:
        retries += 1
        print(f"Error creating connection pool: {e}")
        if retries < MAX_RETRIES:
            print(f"Retrying in {RETRY_DELAY} seconds... ({retries}/{MAX_RETRIES})")
            time.sleep(RETRY_DELAY)
        else:
            print("Failed to create connection pool after multiple retries.")
            sys.exit(1) # アプリケーションを終了

# データベース接続を取得するための依存関係
def get_db_connection():
    if cnx_pool is None:
        raise ConnectionError("Database connection pool is not available.")
    try:
        # プールから接続を取得
        conn = cnx_pool.get_connection()
        yield conn
    except mysql.connector.Error as e:
        print(f"Error getting connection from pool: {e}")
        yield None
    finally:
        # 接続をプールに返す
        if 'conn' in locals() and conn.is_connected():
            conn.close()
            # print("Connection returned to the pool.")
