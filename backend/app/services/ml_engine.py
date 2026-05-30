import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OrdinalEncoder
from typing import List, Dict, Any

class MLEngine:
    @staticmethod
    def detect_anomalies(data: List[Dict[str, Any]], selected_columns: List[str]) -> Dict[str, Any]:
        """
        Fits an IsolationForest model on selected columns (numerical and categorical).
        Returns the indices of the anomalous rows and their scores.
        """
        try:
            if not data:
                return {"anomaly_indices": [], "scores": []}
            
            df = pd.DataFrame(data)
            df_subset = df[selected_columns].copy()

            # Handle Categorical Encoding for ML
            cat_cols = df_subset.select_dtypes(exclude=[np.number]).columns
            if not cat_cols.empty:
                encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
                df_subset[cat_cols] = encoder.fit_transform(df_subset[cat_cols].astype(str))

            # Fill any remaining NaNs after encoding (should be handled by DataEngine but just in case)
            df_subset = df_subset.fillna(0)

            # Fit Isolation Forest
            clf = IsolationForest(contamination=0.05, random_state=42)
            preds = clf.fit_predict(df_subset)
            scores = clf.decision_function(df_subset) # Lower scores are more anomalous

            # IsolationForest returns -1 for outliers
            anomaly_indices = [int(i) for i, pred in enumerate(preds) if pred == -1]
            
            # Map indices to specific scores for the insights card
            result_scores = [float(scores[i]) for i in anomaly_indices]

            return {
                "anomaly_indices": anomaly_indices,
                "scores": result_scores
            }

        except Exception as e:
            raise Exception(f"Anomaly detection failed: {str(e)}")
