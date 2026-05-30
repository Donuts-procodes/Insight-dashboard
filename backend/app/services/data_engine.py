import pandas as pd
import numpy as np
from io import BytesIO
from typing import Dict, Any, List, Union
from sklearn.impute import KNNImputer

class DataEngine:
    @staticmethod
    def parse_and_clean(file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Parses CSV/XLSX file, handles missing values, and returns cleaned data.
        """
        try:
            # 1. Parsing
            if filename.endswith('.csv'):
                df = pd.read_csv(BytesIO(file_content))
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(BytesIO(file_content))
            else:
                raise ValueError("Unsupported file format. Please upload CSV or Excel.")

            # 2. Basic Cleaning: Remove completely empty rows/columns
            df.dropna(how='all', inplace=True)
            df.dropna(axis=1, how='all', inplace=True)

            # 3. Handle Missing Numerical Values
            num_cols = df.select_dtypes(include=[np.number]).columns
            if not num_cols.empty:
                # Use KNNImputer for numerical columns if there are missing values
                if df[num_cols].isnull().any().any():
                    imputer = KNNImputer(n_neighbors=5)
                    df[num_cols] = imputer.fit_transform(df[num_cols])

            # 4. Handle Missing Categorical Values
            cat_cols = df.select_dtypes(exclude=[np.number]).columns
            for col in cat_cols:
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else "Unknown")

            # 5. Prepare Metadata
            schema = []
            for col in df.columns:
                schema.append({
                    "name": col,
                    "type": str(df[col].dtype)
                })

            return {
                "data": df.to_dict(orient='records'),
                "schema": schema,
                "row_count": len(df),
                "column_count": len(df.columns)
            }

        except Exception as e:
            raise Exception(f"Error processing file {filename}: {str(e)}")
