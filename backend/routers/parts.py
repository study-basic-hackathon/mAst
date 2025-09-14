from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
import mysql.connector
import shutil
import os
import schemas
from crud import parts as crud_parts
from database import get_db_connection

router = APIRouter(
    prefix="/parts",
    tags=["parts"],
)

@router.get("", response_model=List[schemas.Part])
def get_parts_data(db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    try:
        parts = crud_parts.get_all(db)
        return parts
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")

@router.delete("/{parts_id}")
def delete_part(parts_id: int, db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    try:
        rowcount = crud_parts.delete_by_id(db, parts_id)
        if rowcount == 0:
            raise HTTPException(status_code=404, detail="Part not found")
        return {"message": "Part deleted successfully", "parts_id": parts_id}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")

class PartCreate(schemas.BaseModel):
    title: str
    category_id: int
    quantity: int

@router.post("", response_model=schemas.Part)
def create_part(part: PartCreate, db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    try:
        created_part = crud_parts.create(db, part.title, part.category_id, part.quantity)
        return created_part
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")

@router.post("/{part_id}/image")
async def upload_part_image(part_id: int, file: UploadFile = File(...), db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")

    # ファイル名を安全に生成（例：part_id.jpg）
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{part_id}{file_extension}"
    file_path = os.path.join("static", "images", file_name)
    
    # ファイルを保存
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")
    finally:
        file.file.close()

    # データベースを更新
    # クライアントがアクセスするためのURLパス（/static/images/1.jpg など）
    image_url = f"/static/images/{file_name}"
    try:
        rowcount = crud_parts.update_image_url(db, part_id, image_url)
        if rowcount == 0:
            # 部品が存在しない場合は、アップロードされたファイルを削除
            os.remove(file_path)
            raise HTTPException(status_code=404, detail="Part not found")
        return {"message": "Image uploaded successfully", "imageUrl": image_url}
    except mysql.connector.Error as e:
        # DBの更新に失敗した場合は、アップロードされたファイルを削除
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
