from pydantic import BaseModel
from typing import List

# --- Inventory Schemas ---
class InventoryUpdate(BaseModel):
    quantity: int

class BatchInventoryUpdateItem(BaseModel):
    id: int
    quantity: int

# --- Parts Schemas ---
class Part(BaseModel):
    id: int
    inventoryId: int
    title: str
    category: str
    quantity: int
    imageUrl: str

    class Config:
        orm_mode = True
