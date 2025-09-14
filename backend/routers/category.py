from fastapi import APIRouter, Depends, HTTPException
from typing import List
import mysql.connector
import schemas
from crud import category as crud_category
from database import get_db_connection

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)

@router.get("", response_model=List[schemas.Category])
def get_categories_data(db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    try:
        categories = crud_category.get_all(db)
        return categories
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
