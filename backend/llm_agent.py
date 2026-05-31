import os
import json
from typing import Dict, Any, List
from openai import OpenAI

class LLMAgent:
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
             raise ValueError("OPENROUTER_API_KEY environment variable not set.")
        
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        self.model_id = "google/gemini-2.0-flash-001" 

    def query_chart_logic(self, schema: List[Dict[str, str]], query: str) -> Dict[str, Any]:
        try:
            schema_str = ", ".join([f"{col['name']} ({col['type']})" for col in schema])
            prompt = f"Data schema: {schema_str}\nUser query: {query}\nReturn JSON with chart_type, x_axis, y_axis, and reasoning."
            
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"LLM Logic error: {str(e)}")

    def explain_anomalies(self, data_sample: List[Dict[str, Any]], anomaly_indices: List[int]) -> Dict[str, Any]:
        try:
            anomalous_data = [data_sample[i] for i in anomaly_indices[:5]]
            prompt = f"Explain these anomalies: {json.dumps(anomalous_data)}\nReturn JSON with summary and insights list."
            
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"LLM Explanation error: {str(e)}")
