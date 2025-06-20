import argparse
import pandas as pd
from tabulate import tabulate
import os

FIELDS = [
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

def load_file(path: str) -> pd.DataFrame:
    ext = os.path.splitext(path)[1].lower()
    if ext in {".xlsx", ".xls"}:
        df = pd.read_excel(path)
    else:
        df = pd.read_csv(path)
    return df


def main():
    parser = argparse.ArgumentParser(description="Print product table from file")
    parser.add_argument("file", help="Path to CSV or Excel file with product data")
    args = parser.parse_args()

    df = load_file(args.file)

    # Ensure all fields exist
    for col in FIELDS:
        if col not in df.columns:
            df[col] = ""

    print(tabulate(df[FIELDS], headers=FIELDS, tablefmt="pretty", showindex=False))


if __name__ == "__main__":
    main()
