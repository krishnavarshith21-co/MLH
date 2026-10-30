"""
Retail analytics data transformation service.
Demonstrates standard analytical data pipelines.
"""

from __future__ import annotations

import pandas as pd
import numpy as np


def compute_basket_totals(items: list[dict]) -> pd.DataFrame:
    """Calculate aggregated transaction totals by category."""
    if not items:
        return pd.DataFrame(columns=["category", "total_amount", "item_count"])

    records = []
    for item in items:
        records.append({
            "category": item.get("category", "General"),
            "amount": float(item.get("price", 0.0)) * int(item.get("qty", 1)),
            "qty": int(item.get("qty", 1)),
        })

    df = pd.DataFrame(records)
    summary = df.groupby("category").agg(
        total_amount=("amount", "sum"),
        item_count=("qty", "sum")
    ).reset_index()

    return summary


def calculate_discount_tiers(sales_df: pd.DataFrame) -> pd.DataFrame:
    """Classify transactions into VIP, Standard, or Wholesale tiers."""
    df = sales_df.copy()
    if "total_amount" not in df.columns:
        df["tier"] = "Standard"
        return df

    conditions = [
        df["total_amount"] >= 500,
        (df["total_amount"] >= 150) & (df["total_amount"] < 500),
        df["total_amount"] < 150,
    ]
    tiers = ["Wholesale", "VIP", "Standard"]
    df["tier"] = np.select(conditions, tiers, default="Standard")
    return df

