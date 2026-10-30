"""
Inventory Reporting API.
Demonstrates Pydantic v1 / FastAPI microservice compatibility patterns.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator

app = FastAPI(title="Inventory Reporting API", version="1.4.0")


class InventoryItem(BaseModel):
    sku: str
    name: str
    quantity: int = Field(ge=0)
    unit_price: float = Field(gt=0)
    warehouse_code: str = "WH-CENTRAL"

    # Pydantic v1 validator syntax (deprecated/changed in Pydantic v2)
    @validator("sku")
    def validate_sku(cls, v: str) -> str:
        if not v.startswith("SKU-"):
            raise ValueError("SKU must start with prefix 'SKU-'")
        return v.upper()


# In-memory demo inventory
INVENTORY_DB: dict[str, dict] = {
    "SKU-101": {"sku": "SKU-101", "name": "Precision Sensor", "quantity": 140, "unit_price": 29.50, "warehouse_code": "WH-EAST"},
    "SKU-102": {"sku": "SKU-102", "name": "Telemetry Node", "quantity": 45, "unit_price": 115.00, "warehouse_code": "WH-WEST"},
}


@app.get("/items/{sku}")
def get_item(sku: str):
    sku_upper = sku.upper()
    if sku_upper not in INVENTORY_DB:
        raise HTTPException(status_code=404, detail="Item not found")
    # Pydantic v1 model instantiation and dict export
    item = InventoryItem(**INVENTORY_DB[sku_upper])
    return item.dict()


@app.post("/items")
def add_item(item: InventoryItem):
    # Pydantic v1 item.dict() usage
    data = item.dict()
    INVENTORY_DB[item.sku] = data
    return {"status": "created", "item": data}

