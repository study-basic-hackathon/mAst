from fastapi import FastAPI
from routers import inventory, parts

app = FastAPI()

# ルーターを登録
app.include_router(inventory.router)
app.include_router(parts.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

# 接続に失敗した場合、関連するエンドポイントは503エラーを返します。
