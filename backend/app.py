from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from data_engine import DataEngine
from ml_engine import MLEngine
from llm_agent import LLMAgent

load_dotenv()

app = Flask(__name__)
# Professional CORS setup with allowed origins
CORS(app, resources={r"/*": {"origins": "*"}})

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format. Please upload a CSV or Excel file."}), 400
        
        content = file.read()
        if not content:
            return jsonify({"error": "Uploaded file is empty."}), 400
            
        result = DataEngine.parse_and_clean(content, file.filename)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 400

@app.route("/detect-anomalies", methods=["POST"])
def detect_anomalies():
    try:
        payload = request.get_json(silent=True)
        if not payload:
            return jsonify({"error": "Invalid JSON payload"}), 400
            
        data = payload.get("data")
        selected_columns = payload.get("selected_columns")
        
        if not data or not selected_columns:
            return jsonify({"error": "Data and selected_columns are required."}), 400

        result = MLEngine.detect_anomalies(data, selected_columns)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"ML error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/explain-anomalies", methods=["POST"])
def explain_anomalies():
    try:
        payload = request.get_json(silent=True)
        if not payload or "data" not in payload or "anomaly_indices" not in payload:
            return jsonify({"error": "Missing required fields"}), 400

        agent = LLMAgent()
        explanation = agent.explain_anomalies(payload.get("data"), payload.get("anomaly_indices"))
        return jsonify(explanation)
    except Exception as e:
        app.logger.error(f"LLM explanation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/query-chart", methods=["POST"])
def query_chart():
    try:
        payload = request.get_json(silent=True)
        if not payload or "schema_info" not in payload or "query" not in payload:
            return jsonify({"error": "Missing schema_info or query"}), 400

        agent = LLMAgent()
        suggestion = agent.query_chart_logic(payload.get("schema_info"), payload.get("query"))
        return jsonify(suggestion)
    except Exception as e:
        app.logger.error(f"LLM query error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Ensure environment variables are loaded
    if os.getenv("OPENROUTER_API_KEY"):
        print("SUCCESS: OPENROUTER_API_KEY loaded from environment.")
    else:
        print("WARNING: OPENROUTER_API_KEY not found in environment.")
    
    app.run(host="0.0.0.0", port=8000, debug=True)
