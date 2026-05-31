import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, LayoutDashboard, Table as TableIcon, Info, ArrowLeft, RefreshCw, BarChart } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataViewTable from './components/DataViewTable';
import ColumnSelector from './components/ColumnSelector';
import ChartViewer from './components/ChartViewer';
import NaturalLanguageChat from './components/NaturalLanguageChat';
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
  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(false);

  const handleUploadSuccess = (payload) => {
    setData(payload.data);
    setSchema(payload.schema);
    setStats(payload.stats || {});
    setAnomalies([]);
    setAiInsight(null);
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

    setIsLoadingAnomalies(true);
    try {
      // 1. Detect Anomaly Indices
      const detectRes = await axios.post('http://localhost:8000/detect-anomalies', {
        data: data,
        selected_columns: [chartConfig.xAxis, chartConfig.yAxis]
      });
      
      const indices = detectRes.data.anomaly_indices;
      setAnomalies(indices);

      // 2. Get LLM Explanation if anomalies exist
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
      setIsLoadingAnomalies(false);
    }
  };

  const handleChartSuggestion = (suggestion) => {
    setChartConfig({
      xAxis: suggestion.x_axis,
      yAxis: suggestion.y_axis,
      chartType: suggestion.chart_type
    });
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
        <NaturalLanguageChat schema={schema} onChartSuggestion={handleChartSuggestion} />
        {data.length > 0 && (
          <button onClick={resetDashboard} className="refresh-btn" title="Reset Dashboard">
            <RefreshCw size={18} />
          </button>
        )}
      </header>

      <main className="dashboard-grid">
        {!data.length ? (
          <div className="welcome-screen">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
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
              
              {stats[chartConfig.yAxis] && (
                <div className="stats-card">
                  <div className="card-header">
                    <BarChart size={18} />
                    <h4>Quick Stats: {chartConfig.yAxis}</h4>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <label>Mean</label>
                      <span>{stats[chartConfig.yAxis].mean.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <label>Median</label>
                      <span>{stats[chartConfig.yAxis].median.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <label>Std Dev</label>
                      <span>{stats[chartConfig.yAxis].std.toFixed(2)}</span>
                    </div>
                    <div className="stat-item">
                      <label>Min/Max</label>
                      <span>{stats[chartConfig.yAxis].min.toLocaleString()} - {stats[chartConfig.yAxis].max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {aiInsight && (
                <div className="insight-card">
                  <div className="card-header">
                    <Info size={18} />
                    <h4>AI Insights</h4>
                  </div>
                  <p className="summary">{aiInsight.summary}</p>
                  <ul>
                    {aiInsight.insights.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
              )}
            </section>

            <section className="visualizer-panel">
              <div className="panel-header">
                <LayoutDashboard size={20} />
                <h3>Data Visualization</h3>
              </div>
              <ChartViewer data={data} config={chartConfig} />
            </section>

            <section className="table-panel">
              <div className="panel-header">
                <TableIcon size={20} />
                <h3>Raw Data Explorer</h3>
                {anomalies.length > 0 && <span className="anomaly-badge">{anomalies.length} Anomalies Found</span>}
              </div>
              <div className="table-wrapper">
                <DataViewTable data={data} anomalies={anomalies} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
