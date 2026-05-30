from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel

from app.services.data_engine import DataEngine
from app.services.ml_engine import MLEngine
from app.services.llm_agent import LLMAgent

app = FastAPI(title="Intelligent Data Analytics Dashboard API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---

class AnomalyRequest(BaseModel):
    data: List[Dict[str, Any]]
    selected_columns: List[str]

class AnomalyExplainRequest(BaseModel):
    data: List[Dict[str, Any]]
    anomaly_indices: List[int]

class ChartQueryRequest(BaseModel):
    schema_info: List[Dict[str, str]]
    query: str

# --- Endpoints ---

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Ingests CSV/Excel files, cleans data, and returns structured JSON + schema.
    """
    try:
        content = await file.read()
        result = DataEngine.parse_and_clean(content, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/detect-anomalies")
async def detect_anomalies(payload: AnomalyRequest):
    """
    Identifies statistical outliers in the provided data for selected columns.
    """
    try:
        result = MLEngine.detect_anomalies(payload.data, payload.selected_columns)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain-anomalies")
async def explain_anomalies(payload: AnomalyExplainRequest):
    """
    Generates human-readable insights for detected anomalies using LLM.
    """
    try:
        agent = LLMAgent()
        explanation = agent.explain_anomalies(payload.data, payload.anomaly_indices)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query-chart")
async def query_chart(payload: ChartQueryRequest):
    """
    Uses Gemini LLM to suggest the best chart type and axis mapping based on user query.
    """
    try:
        agent = LLMAgent()
        suggestion = agent.query_chart_logic(payload.schema_info, payload.query)
        return suggestion
    except ValueError as ve:
        raise HTTPException(status_code=401, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
