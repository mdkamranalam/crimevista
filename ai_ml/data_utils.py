import re
from pathlib import Path

import pandas as pd


class DatasetError(RuntimeError):
    """Raised when the required crime dataset cannot be loaded."""


def _normalize_column_name(column_name):
    return re.sub(r"[^a-z0-9]+", "", str(column_name).lower())


def _find_column(df, aliases):
    normalized_columns = {_normalize_column_name(column): column for column in df.columns}
    for alias in aliases:
        normalized_alias = _normalize_column_name(alias)
        if normalized_alias in normalized_columns:
            return normalized_columns[normalized_alias]
    return None


def load_crime_dataframe(data_path, *, require_time_column=False):
    data_path = Path(data_path)
    if not data_path.exists():
        raise DatasetError(f"Dataset not found at {data_path}")

    try:
        raw_text = data_path.read_text(encoding="utf-8-sig", errors="ignore")
    except OSError as exc:
        raise DatasetError(f"Could not read dataset at {data_path}: {exc}") from exc

    if raw_text.strip().startswith("version https://git-lfs.github.com/spec/v1"):
        raise DatasetError(
            "The dataset file is a Git LFS pointer instead of the actual CSV. "
            "Run 'git lfs pull' from the repository root or restore the file from the project source."
        )

    try:
        df = pd.read_csv(data_path, low_memory=False)
    except Exception as exc:
        raise DatasetError(f"Failed to read CSV data from {data_path}: {exc}") from exc

    if df.empty:
        raise DatasetError("The dataset is empty.")

    lat_col = _find_column(df, ["latitude", "lat", "y", "ycoordinate"])
    lon_col = _find_column(df, ["longitude", "lon", "lng", "long", "x", "xcoordinate"])
    if lat_col is None or lon_col is None:
        available = ", ".join(map(str, df.columns.tolist()))
        raise DatasetError(
            "Could not locate latitude/longitude columns. "
            f"Available columns: {available}"
        )

    if require_time_column:
        time_col = _find_column(df, ["fir_month", "month", "crime_month", "incident_month", "monthyear"])
        if time_col is None:
            available = ", ".join(map(str, df.columns.tolist()))
            raise DatasetError(
                "Could not locate a time column for temporal analysis. "
                f"Available columns: {available}"
            )
        return df, lat_col, lon_col, time_col

    return df, lat_col, lon_col
