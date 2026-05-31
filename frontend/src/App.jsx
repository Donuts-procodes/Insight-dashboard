import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, LayoutDashboard, Info, ArrowLeft, BarChart, Eye, Target, X } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataViewTable from './components/DataViewTable';
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
  const [showFullTable, setShowFullTable] = useState(false);

  const handleUploadSuccess = (payload) => {
    setIsLoading(true);
    // Simulated processing delay for better UX
    setTimeout(() => {
      setData(payload.data);
      setSchema(payload.schema);
      setStats(payload.stats || {});
      setAnomalies([]);
      setAiInsight(null);
      setIsLoading(false);
    }, 1500);
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
      console.error("Anomaly detection pipeline failed", err);
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
            <h1>Insight<span>Dashboard</span></h1>
          </div>
        </div>
        
        {data.length > 0 && (
          <button onClick={() => setShowFullTable(true)} className="view-table-btn">
            <Eye size={18} />
            View Full Table
          </button>
        )}
      </header>

      <main className="dashboard-grid">
        {!data.length ? (
          <div className="welcome-screen">
            {isLoading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Analyzing Dataset...</p>
              </div>
            ) : (
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            )}
          </div>
        ) : (
          <>
            <section className="control-panel">
              <ColumnSelector 
                schema={schema} 
                config={chartConfig} 
                setConfig={setChartConfig} 
                onRunAnomalies={runAnomalyDetection}
              />
              
              <div className="stats-card">
                <div className="card-header">
                  <BarChart size={18} />
                  <h4>Data Insights</h4>
                </div>
                <div className="stats-grid">
                  {stats[chartConfig.yAxis] && (
                    <>
                      <div className="stat-item">
                        <label>Mean</label>
                        <span>{stats[chartConfig.yAxis].mean.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <label>Median</label>
                        <span>{stats[chartConfig.yAxis].median.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="stat-item highlight">
                    <label>Anomalies</label>
                    <span className={anomalies.length > 0 ? 'text-error' : ''}>
                      {anomalies.length} Found
                    </span>
                  </div>
                  <div className="stat-item">
                    <label>Total Rows</label>
                    <span>{data.length}</span>
                  </div>
                </div>
              </div>

              {aiInsight && (
                <div className="insight-card">
                  <div className="card-header">
                    <Info size={18} />
                    <h4>AI Summary</h4>
                  </div>
                  <p className="summary">{aiInsight.summary}</p>
                </div>
              )}
            </section>

            <section className="visualizer-panel">
              <div className="panel-header">
                <LayoutDashboard size={20} />
                <h3>Visualization</h3>
              </div>
              <ChartViewer data={data} config={chartConfig} />
            </section>
          </>
        )}
      </main>

      {showFullTable && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><TableIcon size={20} /> Complete Dataset</h3>
              <button onClick={() => setShowFullTable(false)} className="close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <DataViewTable data={data} anomalies={anomalies} />
            </div>
          </div>
        </div>
      )}

      {isLoading && data.length > 0 && (
        <div className="loading-bar-top"></div>
      )}
    </div>
  );
}

export default App;
