#!/usr/bin/env python3
"""Print a product table from a CSV or Excel file."""

import argparse
import os
from typing import Iterable

import pandas as pd
from tabulate import tabulate

FIELDS: Iterable[str] = [
    "ID",
    "Type",
    "SKU",
    "Name",
    "Description",
    "Short description",
    "Regular price",
    "Sale price",
    "Categories",
    "Images",
    "Stock status",
    "Stock quantity",
]

def load_file(path: str, delimiter: str = ",") -> pd.DataFrame:
    """Load a CSV or Excel file into a :class:`pandas.DataFrame`."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path!r} does not exist")

    ext = os.path.splitext(path)[1].lower()
    if ext in {".xlsx", ".xls"}:
        return pd.read_excel(path)
    return pd.read_csv(path, delimiter=delimiter, encoding="utf-8-sig")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Print product table from CSV or Excel"
    )
    parser.add_argument("file", help="Path to CSV or Excel file with product data")
    parser.add_argument(
        "-d",
        "--delimiter",
        default=",",
        help="Delimiter used in CSV files (default: ',')",
    )
    args = parser.parse_args()

    df = load_file(args.file, delimiter=args.delimiter)

    # Ensure all required columns exist
    for col in FIELDS:
        if col not in df.columns:
            df[col] = ""

    print(tabulate(df[list(FIELDS)], headers=FIELDS, tablefmt="pretty", showindex=False))


if __name__ == "__main__":
    main()
