"""Tests for verification runner output parsing."""

from app.verification.runner import _parse_pytest_output


def test_parse_pytest_output_clean():
    output = "12 passed in 1.45s"
    passed, failed = _parse_pytest_output(output)
    assert passed == 12
    assert failed == 0


def test_parse_pytest_output_failures():
    output = "FAILED tests/test_analytics.py::test_fail\n2 failed, 10 passed in 2.30s"
    passed, failed = _parse_pytest_output(output)
    assert passed == 10
    assert failed == 2


def test_parse_pytest_output_errors():
    output = "1 error, 5 passed in 0.89s"
    passed, failed = _parse_pytest_output(output)
    assert passed == 5
    assert failed == 1

