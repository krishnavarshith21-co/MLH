"""
Tests for data_processor module.
These tests verify the functional behavior regardless of pandas version.
After migration from DataFrame.append() to pd.concat(), all tests should still pass.
"""

import pandas as pd
import numpy as np
import pytest

from src.data_processor import (
    create_sales_report,
    merge_inventory_updates,
    aggregate_monthly_metrics,
    build_customer_profile,
)


class TestCreateSalesReport:
    def test_basic_report(self):
        transactions = [
            {"date": "2024-01-01", "product": "Widget A", "quantity": 10, "price": 5.0},
            {"date": "2024-01-02", "product": "Widget B", "quantity": 3, "price": 15.0},
        ]
        result = create_sales_report(transactions)

        assert len(result) == 2
        assert list(result.columns) == ["date", "product", "quantity", "price", "total"]
        assert result.iloc[0]["total"] == 50.0
        assert result.iloc[1]["total"] == 45.0

    def test_empty_transactions(self):
        result = create_sales_report([])
        assert len(result) == 0
        assert "total" in result.columns

    def test_single_transaction(self):
        transactions = [
            {"date": "2024-03-15", "product": "Gadget", "quantity": 1, "price": 99.99},
        ]
        result = create_sales_report(transactions)
        assert len(result) == 1
        assert result.iloc[0]["product"] == "Gadget"


class TestMergeInventoryUpdates:
    def test_merge_updates(self):
        current = pd.DataFrame({
            "sku": ["SKU001"],
            "name": ["Product A"],
            "stock": [100],
            "warehouse": ["WH-1"],
        })
        updates = [
            {"sku": "SKU002", "name": "Product B", "stock": 50, "warehouse": "WH-2"},
        ]
        result = merge_inventory_updates(current, updates)

        assert len(result) == 2
        assert result.iloc[1]["sku"] == "SKU002"

    def test_empty_updates(self):
        current = pd.DataFrame({
            "sku": ["SKU001"],
            "name": ["Product A"],
            "stock": [100],
            "warehouse": ["WH-1"],
        })
        result = merge_inventory_updates(current, [])
        assert len(result) == 1


class TestAggregateMonthlyMetrics:
    def test_aggregate(self):
        day1 = pd.DataFrame({"metric": ["views"], "value": [100]})
        day2 = pd.DataFrame({"metric": ["views"], "value": [150]})
        result = aggregate_monthly_metrics([day1, day2])

        assert len(result) == 2
        assert result["value"].sum() == 250

    def test_empty_list(self):
        result = aggregate_monthly_metrics([])
        assert len(result) == 0


class TestBuildCustomerProfile:
    def test_build_profile(self):
        base = pd.DataFrame(columns=["customer_id", "item", "amount", "date"])
        purchases = [
            {"customer_id": "C001", "item": "Laptop", "amount": 999.99, "date": "2024-01-10"},
            {"customer_id": "C001", "item": "Mouse", "amount": 29.99, "date": "2024-01-11"},
        ]
        result = build_customer_profile(base, purchases)

        assert len(result) == 2
        assert result.iloc[0]["item"] == "Laptop"

