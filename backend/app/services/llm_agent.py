import os
import json
from typing import Dict, Any, List
from google import genai
from pydantic import BaseModel, Field

class ChartSuggestion(BaseModel):
    chart_type: str = Field(description="The type of chart to render: 'line', 'bar', or 'scatter'")
    x_axis: str = Field(description="The column name to use for the X axis")
    y_axis: str = Field(description="The column name to use for the Y axis")
    reasoning: str = Field(description="Brief explanation of why this chart was chosen")

class AnomalyExplanation(BaseModel):
    summary: str = Field(description="A concise, high-level summary of the anomalies detected")
    insights: List[str] = Field(description="A list of specific observations (e.g., 'Revenue dropped 45% on Oct 14th')")

class LLMAgent:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-2.0-flash" 

    def query_chart_logic(self, schema: List[Dict[str, str]], query: str) -> Dict[str, Any]:
        # ... (unchanged logic) ...
        try:
            schema_str = ", ".join([f"{col['name']} ({col['type']})" for col in schema])
            
            prompt = f"""
            You are a data visualization expert. Given the following data schema:
            {schema_str}
            
            The user wants to: "{query}"
            
            Determine the best chart type (line, bar, or scatter) and the appropriate columns for X and Y axes.
            """

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": ChartSuggestion,
                }
            )

            return response.parsed.model_dump()

        except Exception as e:
            raise Exception(f"LLM Agent failed to process query: {str(e)}")

    def explain_anomalies(self, data_sample: List[Dict[str, Any]], anomaly_indices: List[int]) -> Dict[str, Any]:
        """
        Generates human-readable insights for detected anomalies.
        """
        try:
            anomalous_data = [data_sample[i] for i in anomaly_indices[:5]] # Limit to 5 for token efficiency
            
            prompt = f"""
            Analyze these detected anomalies in a dataset:
            {json.dumps(anomalous_data)}
            
            Provide a concise summary and specific insights. 
            Example insight: "Revenue dropped 45% below the moving average on Oct 14th."
            """

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AnomalyExplanation,
                }
            )

            return response.parsed.model_dump()

        except Exception as e:
            raise Exception(f"LLM Agent failed to explain anomalies: {str(e)}")
