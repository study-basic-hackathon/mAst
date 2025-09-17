from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
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

@router.post("", response_model=schemas.Part)
async def create_part(
    title: str = Form(...),
    category_id: int = Form(...),
    quantity: int = Form(...),
    file: Optional[UploadFile] = File(None),
    db: mysql.connector.MySQLConnection = Depends(get_db_connection)
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")

    image_url = None
    file_path = None

    try:
        # 部品情報と在庫情報をデータベースに登録
        created_part = crud_parts.create(db, title, category_id, quantity)
        part_id = created_part['id']

        if file:
            # ファイル名を安全に生成
            file_extension = os.path.splitext(file.filename)[1]
            file_name = f"{part_id}{file_extension}"
            file_path = os.path.join("static", "images", file_name)

            # ファイルを保存
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # 画像URLを生成
            image_url = f"/static/images/{file_name}"
            
            # データベースの画像URLを更新
            crud_parts.update_image_url(db, part_id, image_url)
            created_part['imageUrl'] = image_url

        db.commit()
        return created_part

    except mysql.connector.Error as e:
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except Exception as e:
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Could not process file: {e}")
    finally:
        if file:
            file.file.close()

@router.post("/{parts_id}/image")
async def upload_part_image(
    parts_id: int,
    file: UploadFile = File(...),
    db: mysql.connector.MySQLConnection = Depends(get_db_connection)
):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")

    file_path = None
    try:
        # ファイル名を安全に生成 (例: 1.jpg)
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{parts_id}{file_extension}"
        
        # 保存先ディレクトリのパスを生成
        save_dir = os.path.join("static", "images")
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, file_name)

        # ファイルを保存
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 画像URLを生成
        image_url = f"/static/images/{file_name}"
        
        # データベースの画像URLを更新
        crud_parts.update_image_url(db, parts_id, image_url)
        
        db.commit()

        return {
            "message": "Image uploaded successfully",
            "parts_id": parts_id,
            "image_url": image_url
        }

    except mysql.connector.Error as e:
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except Exception as e:
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Could not process file: {e}")
    finally:
        if file:
            file.file.close()
