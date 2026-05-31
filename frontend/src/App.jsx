import React, { useState } from 'react';
import axios from 'axios';
import { Brain, LayoutDashboard, Info, ArrowLeft, BarChart, Target } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ColumnSelector from './components/ColumnSelector';
import ChartViewer from './components/ChartViewer';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [stats, setStats] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    chartType: 'line'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSuccess = (payload) => {
    setIsLoading(true);
    setTimeout(() => {
      const data = payload.data;
      const schema = payload.schema;
      
      setData(data);
      setSchema(schema);
      setStats(payload.stats || {});
      setAnomalies([]);
      setAiInsight(null);

      if (schema && schema.length >= 2) {
        const numCol = schema.find(col => 
          col.type.includes('int') || col.type.includes('float') || col.type.includes('number')
        );
        const xAxis = schema[0].name;
        const yAxis = numCol ? numCol.name : schema[1].name;

        setChartConfig({
          xAxis: xAxis,
          yAxis: yAxis,
          chartType: 'line'
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  const resetDashboard = () => {
    setData([]);
    setSchema([]);
    setStats({});
    setAnomalies([]);
    setAiInsight(null);
    setChartConfig({ xAxis: '', yAxis: '', chartType: 'line' });
  };

  const runAnomalyDetection = async () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis) return;
    setIsLoading(true);
    try {
      const detectRes = await axios.post('http://localhost:8000/detect-anomalies', {
        data: data,
        selected_columns: [chartConfig.xAxis, chartConfig.yAxis]
      });
      const indices = detectRes.data.anomaly_indices;
      setAnomalies(indices);

      if (indices.length > 0) {
        const explainRes = await axios.post('http://localhost:8000/explain-anomalies', {
          data: data,
          anomaly_indices: indices
        });
        setAiInsight(explainRes.data);
      } else {
        setAiInsight({ summary: "No significant anomalies detected in the selected data.", insights: [] });
      }
    } catch (err) {
      console.error("Anomaly detection failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          {data.length > 0 && (
            <button onClick={resetDashboard} className="back-btn" title="Back to Upload">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="logo">
            <Brain className="logo-icon" />
            <span>InsightDashboard</span>
          </div>
        </div>
      </header>

      <main className="dashboard-body">
        {!data.length ? (
          <div className="welcome-screen">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p style={{color: 'var(--text-muted)'}}>Analyzing Dataset...</p>
              </div>
            ) : (
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            )}
          </div>
        ) : (
          <>
            <aside className="sidebar">
              <div className="card">
                <ColumnSelector 
                  schema={schema} 
                  activeConfig={chartConfig} 
                  onApplyConfig={(newConfig) => setChartConfig(newConfig)}
                  onRunAnomalies={runAnomalyDetection}
                />
              </div>

              <div className="card">
                <h3 className="card-title"><BarChart size={16}/> Data Insights</h3>
                <div className="stats-grid">
                  {stats[chartConfig.yAxis] && (
                    <>
                      <div className="stat-item">
                        <label>Mean</label>
                        <span className="stat-value">{stats[chartConfig.yAxis].mean.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <label>Median</label>
                        <span className="stat-value">{stats[chartConfig.yAxis].median.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="stat-item">
                    <label>Anomalies</label>
                    <span className={`stat-value ${anomalies.length > 0 ? 'text-error' : ''}`}>
                      {anomalies.length}
                    </span>
                  </div>
                  <div className="stat-item">
                    <label>Total Rows</label>
                    <span className="stat-value">{data.length}</span>
                  </div>
                </div>
              </div>

              {aiInsight && (
                <div className="card">
                  <h3 className="card-title"><Info size={16}/> AI Summary</h3>
                  <p className="ai-summary-text">{aiInsight.summary}</p>
                </div>
              )}
            </aside>

            <section className="main-view">
              <div className="card chart-card">
                <h3 className="card-title"><LayoutDashboard size={16}/> Visualization</h3>
                <div className="chart-wrapper">
                  <ChartViewer data={data} config={chartConfig} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {isLoading && data.length > 0 && <div className="loading-bar-top"></div>}
    </div>
  );
}

export default App;
