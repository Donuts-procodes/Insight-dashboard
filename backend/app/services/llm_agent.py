import os
import json
from typing import Dict, Any, List
from openai import OpenAI
from pydantic import BaseModel, Field

class ChartSuggestion(BaseModel):
    chart_type: str = Field(description="The type of chart to render: 'line', 'bar', or 'scatter'")
    x_axis: str = Field(description="The column name to use for the X axis")
    y_axis: str = Field(description="The column name to use for the Y axis")
    reasoning: str = Field(description="Brief explanation of why this chart was chosen")

class AnomalyExplanation(BaseModel):
    summary: str = Field(description="A concise, high-level summary of the anomalies detected")
    insights: List[str] = Field(description="A list of specific observations")

class LLMAgent:
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set. Please provide a valid API key.")
        
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        self.model_id = "google/gemini-2.0-flash-001" 

    def query_chart_logic(self, schema: List[Dict[str, str]], query: str) -> Dict[str, Any]:
        """
        Uses OpenRouter (Gemini 2.0) to map a natural language query to a specific chart configuration.
        """
        try:
            schema_str = ", ".join([f"{col['name']} ({col['type']})" for col in schema])
            
            prompt = f"""
            You are a data visualization expert. Given the following data schema:
            {schema_str}
            
            The user wants to: "{query}"
            
            Determine the best chart type (line, bar, or scatter) and the appropriate columns for X and Y axes.
            Return a valid JSON object matching this schema:
            {{"chart_type": "line|bar|scatter", "x_axis": "column_name", "y_axis": "column_name", "reasoning": "string"}}
            """

            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            raise Exception(f"LLM Agent failed to process query: {str(e)}")

    def explain_anomalies(self, data_sample: List[Dict[str, Any]], anomaly_indices: List[int]) -> Dict[str, Any]:
        """
        Generates human-readable insights for detected anomalies via OpenRouter.
        """
        try:
            anomalous_data = [data_sample[i] for i in anomaly_indices[:5]]
            
            prompt = f"""
            Analyze these detected anomalies in a dataset:
            {json.dumps(anomalous_data)}
            
            Provide a concise summary and specific insights. 
            Return a valid JSON object matching this schema:
            {{"summary": "string", "insights": ["string", "string"]}}
            """

            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            raise Exception(f"LLM Agent failed to explain anomalies: {str(e)}")
