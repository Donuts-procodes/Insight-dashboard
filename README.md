# InsightDashboard: Intelligent Data Analytics Suite

InsightDashboard is a professional-grade data visualization and analytics platform designed to bridge the gap between raw data and actionable insights. By combining robust statistical engines with modern LLM orchestration, the platform automates the most time-consuming parts of data science: cleaning, anomaly detection, and exploratory visualization.

## 🚀 Core Features

### 1. Automated "Smart Data" Preprocessing
The platform features an intelligent ingestion layer that automatically handles dirty data. 
- **Missing Value Imputation**: Uses `KNNImputer` for numerical gaps and statistical mode strategies for categorical data.
- **Auto-Cleaning**: Automatically removes empty rows/columns and handles inconsistent data types.
- **Schema Recognition**: Instantly parses CSV/XLSX files to build a structured data model.

### 2. AI-Powered Anomaly Detection
Go beyond simple charts with built-in unsupervised machine learning.
- **Isolation Forest Integration**: Scans numerical and categorical features to identify statistical outliers.
- **Dynamic Highlighting**: Anomalous rows are instantly flagged in the data explorer for manual review.
- **Descriptive Insights**: Automatically generates human-readable explanations for why certain data points were flagged as anomalies.

### 3. Natural Language Querying (NLQ)
Interact with your data using plain English.
- **Zero-Config Visualization**: Type queries like *"Show me the correlation between revenue and marketing spend"* to instantly generate the appropriate chart.
- **LLM Orchestration**: Uses advanced LLMs to map natural language to precise chart configurations (Line, Bar, Scatter).

### 4. Professional Analytics Dashboard
- **Real-time Statistics**: Instantly view Mean, Median, Standard Deviation, and Min/Max for any selected metric.
- **Interactive Visualizer**: Responsive charts powered by Recharts with dark-mode optimized tooltips and legends.
- **High-Performance Explorer**: A specialized grid for navigating large datasets with real-time anomaly overlays.

## 🛠️ Technical Stack

### Backend (Python/FastAPI)
- **FastAPI**: High-performance API framework.
- **Pandas & NumPy**: Core data manipulation and statistical processing.
- **Scikit-Learn**: Machine learning engine for `IsolationForest` and `KNNImputer`.
- **OpenRouter/OpenAI SDK**: Orchestration layer for LLM-driven insights and NLQ.

### Frontend (React/Vite)
- **React 19**: Modern component-based architecture.
- **Recharts**: D3-based charting library for responsive visualizations.
- **Lucide React**: Professional iconography suite.
- **Axios**: Robust HTTP client for API communication.
- **CSS3 (Vanilla)**: Custom "Gemini Dark" themed aesthetic with glassmorphism accents.

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenRouter API Key

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your API Key:
   ```bash
   export OPENROUTER_API_KEY="your_key_here" # Windows: $env:OPENROUTER_API_KEY="your_key_here"
   ```
5. Start the server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security & Architecture
- **Sandboxed Processing**: All data cleaning and ML inference happen in memory without persistent file storage.
- **Credential Safety**: Built to strictly use environment variables for sensitive API keys.
- **Separation of Concerns**: Decoupled service architecture allows for independent scaling of the ML Engine, Data Engine, and LLM Orchestrator.
