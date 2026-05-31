from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from data_engine import DataEngine
from ml_engine import MLEngine
from llm_agent import LLMAgent

load_dotenv()

app = Flask(__name__)
CORS(app)

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
            return jsonify({"error": "Invalid file format."}), 400
        content = file.read()
        result = DataEngine.parse_and_clean(content, file.filename)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/detect-anomalies", methods=["POST"])
def detect_anomalies():
    try:
        payload = request.get_json()
        result = MLEngine.detect_anomalies(payload.get("data"), payload.get("selected_columns"))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/explain-anomalies", methods=["POST"])
def explain_anomalies():
    try:
        payload = request.get_json()
        agent = LLMAgent()
        explanation = agent.explain_anomalies(payload.get("data"), payload.get("anomaly_indices"))
        return jsonify(explanation)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/query-chart", methods=["POST"])
def query_chart():
    try:
        payload = request.get_json()
        agent = LLMAgent()
        suggestion = agent.query_chart_logic(payload.get("schema_info"), payload.get("query"))
        return jsonify(suggestion)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
