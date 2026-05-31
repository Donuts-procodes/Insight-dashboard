import pandas as pd
import numpy as np
from io import BytesIO
from typing import Dict, Any
from sklearn.impute import KNNImputer

class DataEngine:
    @staticmethod
    def parse_and_clean(file_content: bytes, filename: str) -> Dict[str, Any]:
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(BytesIO(file_content))
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(BytesIO(file_content))
            else:
                raise ValueError("Unsupported file format.")

            df.dropna(how='all', inplace=True)
            df.dropna(axis=1, how='all', inplace=True)

            num_cols = df.select_dtypes(include=[np.number]).columns
            if not num_cols.empty and df[num_cols].isnull().any().any():
                imputer = KNNImputer(n_neighbors=5)
                df[num_cols] = imputer.fit_transform(df[num_cols])

            cat_cols = df.select_dtypes(exclude=[np.number]).columns
            for col in cat_cols:
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else "Unknown")

            stats = {}
            for col in num_cols:
                stats[col] = {
                    "mean": float(df[col].mean()),
                    "median": float(df[col].median()),
                    "std": float(df[col].std()),
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "count": int(df[col].count())
                }

            schema = [{"name": col, "type": str(df[col].dtype)} for col in df.columns]

            return {
                "data": df.to_dict(orient='records'),
                "schema": schema,
                "stats": stats,
                "row_count": len(df),
                "column_count": len(df.columns)
            }
        except Exception as e:
            raise Exception(f"Parsing error: {str(e)}")
