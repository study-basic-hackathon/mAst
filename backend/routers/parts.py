from fastapi import APIRouter, Depends, HTTPException
from typing import List
import mysql.connector
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
