# InsightDashboard: Intelligent Data Analytics Suite

InsightDashboard is a professional-grade data visualization and analytics platform designed to bridge the gap between raw data and actionable insights. By combining robust statistical engines with modern LLM orchestration, the platform automates the most time-consuming parts of data science: cleaning, anomaly detection, and exploratory visualization.

## 🚀 Core Features

### 1. Automated "Smart Data" Preprocessing
The platform features an intelligent ingestion layer that automatically handles dirty data. 
- **Missing Value Imputation**: Uses statistical strategies for categorical data and robust cleaning for numerical gaps.
- **Auto-Cleaning**: Automatically removes empty rows/columns and handles inconsistent data types.
- **Schema Recognition**: Instantly parses CSV/XLSX files to build a structured data model.

### 2. AI-Powered Anomaly Detection
Go beyond simple charts with built-in unsupervised machine learning.
- **Isolation Forest Integration**: Scans numerical features to identify statistical outliers.
- **Descriptive Insights**: Automatically generates human-readable explanations for why certain data points were flagged as anomalies using LLMs.

### 3. Professional Analytics Dashboard
- **Real-time Statistics**: Instantly view Mean, Median, and total counts for any selected metric.
- **Interactive Visualizer**: Responsive charts powered by Recharts with dark-mode optimized tooltips and legends.
- **Responsive Design**: Fully centric and responsive UI that works across all device sizes.

## 🛠️ Technical Stack

### Backend (Python/Flask)
- **Flask**: Lightweight web framework for API routing.
- **Pandas**: Core data manipulation and statistical processing.
- **Scikit-Learn**: Machine learning engine for `IsolationForest`.
- **OpenRouter/LLM**: Orchestration layer for AI-driven data explanations.

### Frontend (React/Vite)
- **React**: Modern component-based architecture.
- **Recharts**: D3-based charting library for responsive visualizations.
- **Lucide React**: Professional iconography suite.
- **Axios**: Robust HTTP client for API communication.
- **CSS3 (Vanilla)**: Custom themed aesthetic with a focus on centering and responsiveness.

## 🔄 System Workflow

1.  **Ingestion**: User uploads a CSV/Excel file via `FileUpload.jsx`.
2.  **Processing**: Backend (`DataEngine`) cleans the data, detects types, and calculates base statistics.
3.  **State Management**: `App.jsx` stores the cleaned dataset and schema, triggering a view switch from "Welcome" to "Dashboard".
4.  **Configuration**: User selects dimensions (X-Axis) and measures (Y-Axis) in `ColumnSelector.jsx`.
5.  **Visualization**: `ChartViewer.jsx` receives the filtered data and renders interactive charts using **Recharts**.
6.  **Intelligence**: (Optional) User triggers `MLEngine` to find anomalies, which are then explained by the `LLMAgent` via AI.

## 📂 Component Mapping

| Component | File | Role |
| :--- | :--- | :--- |
| **API Gateway** | `backend/app.py` | Entry point for all frontend requests and route coordinator. |
| **Data Engine** | `backend/data_engine.py` | Handles all CSV/Excel parsing and data cleaning logic. |
| **Dashboard** | `frontend/src/App.jsx` | Main orchestrator of frontend state and navigation. |
| **Chart Artist** | `frontend/src/components/ChartViewer.jsx` | Responsible for drawing the responsive SVG charts. |
| **Uploader** | `frontend/src/components/FileUpload.jsx` | Drag-and-drop interface for data ingestion. |

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenRouter API Key (optional for AI features)

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
4. Start the server:
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
