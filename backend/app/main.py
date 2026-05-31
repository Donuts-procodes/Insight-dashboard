from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from app.services.data_engine import DataEngine
from app.services.ml_engine import MLEngine
from app.services.llm_agent import LLMAgent

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

# --- Endpoints ---

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    Ingests CSV/Excel files, cleans data, and returns structured JSON + schema.
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        content = file.read()
        result = DataEngine.parse_and_clean(content, file.filename)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/detect-anomalies", methods=["POST"])
def detect_anomalies():
    """
    Identifies statistical outliers in the provided data for selected columns.
    """
    try:
        payload = request.get_json()
        data = payload.get("data")
        selected_columns = payload.get("selected_columns")
        
        if not data or not selected_columns:
            return jsonify({"error": "Missing data or selected_columns"}), 400

        result = MLEngine.detect_anomalies(data, selected_columns)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/explain-anomalies", methods=["POST"])
def explain_anomalies():
    """
    Generates human-readable insights for detected anomalies using LLM.
    """
    try:
        payload = request.get_json()
        data = payload.get("data")
        anomaly_indices = payload.get("anomaly_indices")

        if not data or anomaly_indices is None:
            return jsonify({"error": "Missing data or anomaly_indices"}), 400

        agent = LLMAgent()
        explanation = agent.explain_anomalies(data, anomaly_indices)
        return jsonify(explanation)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/query-chart", methods=["POST"])
def query_chart():
    """
    Uses LLM to suggest the best chart type and axis mapping based on user query.
    """
    try:
        payload = request.get_json()
        schema_info = payload.get("schema_info")
        query = payload.get("query")

        if not schema_info or not query:
            return jsonify({"error": "Missing schema_info or query"}), 400

        agent = LLMAgent()
        suggestion = agent.query_chart_logic(schema_info, query)
        return jsonify(suggestion)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
