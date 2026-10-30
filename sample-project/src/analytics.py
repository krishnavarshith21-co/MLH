"""
Analytics module for the sample project.
Contains additional DataFrame.append() usage patterns.
"""

import pandas as pd


def generate_trend_report(data_points: list[dict]) -> pd.DataFrame:
    """Generate a trend report from data points."""
    report = pd.DataFrame(columns=["timestamp", "metric", "value"])

    for point in data_points:
        row = pd.DataFrame([{
            "timestamp": point["timestamp"],
            "metric": point["metric"],
            "value": point["value"],
        }])
        # Deprecated DataFrame.append()
        report = report.append(row, ignore_index=True)

    return report


def combine_regional_data(regional_frames: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Combine data from multiple regions into a single DataFrame."""
    combined = pd.DataFrame()

    for region, data in regional_frames.items():
        data = data.copy()
        data["region"] = region
        # Deprecated DataFrame.append()
        combined = combined.append(data, ignore_index=True)

    return combined

