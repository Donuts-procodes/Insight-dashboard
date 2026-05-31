import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OrdinalEncoder
from typing import List, Dict, Any

class MLEngine:
    @staticmethod
    def detect_anomalies(data: List[Dict[str, Any]], selected_columns: List[str]) -> Dict[str, Any]:
        try:
            if not data:
                return {"anomaly_indices": [], "scores": []}
            
            df = pd.DataFrame(data)
            df_subset = df[selected_columns].copy()

            cat_cols = df_subset.select_dtypes(exclude=[np.number]).columns
            if not cat_cols.empty:
                encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
                df_subset[cat_cols] = encoder.fit_transform(df_subset[cat_cols].astype(str))

            df_subset = df_subset.fillna(0)

            clf = IsolationForest(contamination=0.05, random_state=42)
            preds = clf.fit_predict(df_subset)
            scores = clf.decision_function(df_subset)

            anomaly_indices = [int(i) for i, pred in enumerate(preds) if pred == -1]
            result_scores = [float(scores[i]) for i in anomaly_indices]

            return {
                "anomaly_indices": anomaly_indices,
                "scores": result_scores
            }
        except Exception as e:
            raise Exception(f"ML error: {str(e)}")
