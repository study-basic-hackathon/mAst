from fastapi import APIRouter, Depends, HTTPException
from typing import List
import mysql.connector
import schemas
from crud import inventory as crud_inventory
from database import get_db_connection

router = APIRouter(
    prefix="/inventory",
    tags=["inventory"],
)

@router.put("/batch")
def update_batch_inventory(items: List[schemas.BatchInventoryUpdateItem], db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    try:
        crud_inventory.update_batch_items(db, items)
        return {"message": "Inventory updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")

@router.put("/{inventory_id}")
def update_inventory(inventory_id: int, item: schemas.InventoryUpdate, db: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection failed")
    if item.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")
    
    try:
        rowcount = crud_inventory.update_item(db, inventory_id, item.quantity)
        if rowcount == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        return {"message": "Inventory updated successfully", "inventory_id": inventory_id, "new_quantity": item.quantity}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
