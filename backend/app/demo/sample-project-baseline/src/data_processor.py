"""
Data processing module for the sample project.
Uses pandas 1.x API including deprecated DataFrame.append() method.
"""

import pandas as pd
import numpy as np


def create_sales_report(transactions: list[dict]) -> pd.DataFrame:
    """Create a sales report from transaction records."""
    df = pd.DataFrame(columns=["date", "product", "quantity", "price", "total"])

    for transaction in transactions:
        row = pd.DataFrame([{
            "date": transaction["date"],
            "product": transaction["product"],
            "quantity": transaction["quantity"],
            "price": transaction["price"],
            "total": transaction["quantity"] * transaction["price"],
        }])
        # Uses deprecated DataFrame.append() — removed in pandas 2.0
        df = df.append(row, ignore_index=True)

    return df


def merge_inventory_updates(
    current_inventory: pd.DataFrame,
    updates: list[dict],
) -> pd.DataFrame:
    """Merge new inventory updates into existing inventory."""
    for update in updates:
        new_row = pd.DataFrame([{
            "sku": update["sku"],
            "name": update["name"],
            "stock": update["stock"],
            "warehouse": update["warehouse"],
        }])
        # Another usage of deprecated DataFrame.append()
        current_inventory = current_inventory.append(new_row, ignore_index=True)

    return current_inventory


def aggregate_monthly_metrics(daily_metrics: list[pd.DataFrame]) -> pd.DataFrame:
    """Aggregate daily metric DataFrames into a monthly summary."""
    result = pd.DataFrame()

    for daily in daily_metrics:
        # Yet another usage of deprecated DataFrame.append()
        result = result.append(daily, ignore_index=True)

    return result


def build_customer_profile(
    base_profile: pd.DataFrame,
    purchase_history: list[dict],
) -> pd.DataFrame:
    """Build enriched customer profile with purchase history."""
    for purchase in purchase_history:
        entry = pd.DataFrame([{
            "customer_id": purchase["customer_id"],
            "item": purchase["item"],
            "amount": purchase["amount"],
            "date": purchase["date"],
        }])
        # DataFrame.append() usage
        base_profile = base_profile.append(entry, ignore_index=True)

    return base_profile

