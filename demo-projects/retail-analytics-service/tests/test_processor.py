"""Unit tests for retail analytics processor."""

import pandas as pd
import pytest
from src.processor import compute_basket_totals, calculate_discount_tiers


def test_empty_basket():
    res = compute_basket_totals([])
    assert len(res) == 0
    assert "category" in res.columns


def test_compute_basket_totals():
    items = [
        {"category": "Electronics", "price": 100.0, "qty": 2},
        {"category": "Electronics", "price": 50.0, "qty": 1},
        {"category": "Apparel", "price": 30.0, "qty": 3},
    ]
    res = compute_basket_totals(items)
    assert len(res) == 2
    elec = res[res["category"] == "Electronics"].iloc[0]
    assert elec["total_amount"] == 250.0
    assert elec["item_count"] == 3


def test_calculate_discount_tiers():
    df = pd.DataFrame({
        "category": ["A", "B", "C"],
        "total_amount": [600, 200, 50]
    })
    res = calculate_discount_tiers(df)
    assert list(res["tier"]) == ["Wholesale", "VIP", "Standard"]

