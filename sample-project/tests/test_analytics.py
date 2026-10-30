"""
Tests for analytics module.
"""

import pandas as pd
import pytest

from src.analytics import generate_trend_report, combine_regional_data


class TestGenerateTrendReport:
    def test_basic_report(self):
        data_points = [
            {"timestamp": "2024-01-01T00:00:00", "metric": "cpu_usage", "value": 45.2},
            {"timestamp": "2024-01-01T01:00:00", "metric": "cpu_usage", "value": 52.1},
        ]
        result = generate_trend_report(data_points)

        assert len(result) == 2
        assert list(result.columns) == ["timestamp", "metric", "value"]

    def test_empty_data(self):
        result = generate_trend_report([])
        assert len(result) == 0


class TestCombineRegionalData:
    def test_combine(self):
        regional = {
            "US": pd.DataFrame({"sales": [100, 200]}),
            "EU": pd.DataFrame({"sales": [150, 250]}),
        }
        result = combine_regional_data(regional)

        assert len(result) == 4
        assert "region" in result.columns
        assert set(result["region"].unique()) == {"US", "EU"}

    def test_single_region(self):
        regional = {
            "APAC": pd.DataFrame({"revenue": [500]}),
        }
        result = combine_regional_data(regional)
        assert len(result) == 1
        assert result.iloc[0]["region"] == "APAC"

