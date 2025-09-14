from pydantic import BaseModel, ConfigDict
from typing import List

# --- Inventory Schemas ---
class InventoryUpdate(BaseModel):
    quantity: int

class BatchInventoryUpdateItem(BaseModel):
    id: int
    quantity: int

# --- Parts Schemas ---
class Part(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    inventoryId: int
    title: str
    category: str
    quantity: int
    imageUrl: str

# --- Category Schemas ---
class Category(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
