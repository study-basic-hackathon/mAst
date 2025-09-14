from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import inventory, parts
import os

app = FastAPI()

# 静的ファイル用のディレクトリが存在することを確認
os.makedirs("static/images", exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# ルーターを登録
app.include_router(inventory.router)
app.include_router(parts.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

# 接続に失敗した場合、関連するエンドポイントは503エラーを返します。
