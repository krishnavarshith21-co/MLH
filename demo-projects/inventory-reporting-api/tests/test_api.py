"""Unit tests for Inventory Reporting API."""

from fastapi.testclient import TestClient
from src.main import app, INVENTORY_DB


client = TestClient(app)


def test_get_existing_item():
    response = client.get("/items/SKU-101")
    assert response.status_code == 200
    data = response.json()
    assert data["sku"] == "SKU-101"
    assert data["name"] == "Precision Sensor"


def test_get_missing_item():
    response = client.get("/items/SKU-999")
    assert response.status_code == 404


def test_add_valid_item():
    new_item = {
        "sku": "SKU-205",
        "name": "Optical Coupler",
        "quantity": 80,
        "unit_price": 14.25,
        "warehouse_code": "WH-NORTH"
    }
    response = client.post("/items", json=new_item)
    assert response.status_code == 200
    assert response.json()["status"] == "created"
    assert response.json()["item"]["sku"] == "SKU-205"

