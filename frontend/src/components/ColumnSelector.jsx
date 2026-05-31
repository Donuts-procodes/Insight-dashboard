import React, { useState, useEffect } from 'react';
import { Target, BarChart2, Check } from 'lucide-react';

const ColumnSelector = ({ schema, activeConfig, onApplyConfig, onRunAnomalies }) => {
    // Local state for dropdowns to prevent live-updating before "OK" is pressed
    const [localConfig, setLocalConfig] = useState({
        xAxis: activeConfig.xAxis || '',
        yAxis: activeConfig.yAxis || '',
        chartType: activeConfig.chartType || 'line'
    });

    // Keep local in sync with active if active changes externally (like on upload)
    useEffect(() => {
        setLocalConfig({
            xAxis: activeConfig.xAxis,
            yAxis: activeConfig.yAxis,
            chartType: activeConfig.chartType
        });
    }, [activeConfig]);

    const handleLocalChange = (key, value) => {
        setLocalConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        if (!localConfig.xAxis || !localConfig.yAxis) {
            alert("Please select both X and Y axes");
            return;
        }
        onApplyConfig(localConfig);
    };

    return (
        <div className="column-selector">
            <div className="selection-group">
                <h4><BarChart2 size={18} /> 1. Configure Chart</h4>
                <div className="controls">
                    <label className="input-label">X Axis (Dimensions)</label>
                    <select 
                        value={localConfig.xAxis} 
                        onChange={(e) => handleLocalChange('xAxis', e.target.value)}
                    >
                        <option value="">Choose Column...</option>
                        {schema.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>

                    <label className="input-label">Y Axis (Values)</label>
                    <select 
                        value={localConfig.yAxis} 
                        onChange={(e) => handleLocalChange('yAxis', e.target.value)}
                    >
                        <option value="">Choose Column...</option>
                        {schema.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>

                    <label className="input-label">Visualization Type</label>
                    <select 
                        value={localConfig.chartType} 
                        onChange={(e) => handleLocalChange('chartType', e.target.value)}
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="area">Area Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="pie">Pie Chart (Distribution)</option>
                    </select>

                    <button 
                        className="btn-primary" 
                        onClick={handleApply}
                        style={{ marginTop: '1rem' }}
                    >
                        <Check size={18} /> OK - Generate Chart
                    </button>
                </div>
            </div>

            <div className="selection-group secondary">
                <h4><Target size={18} /> Optional: Data Insights</h4>
                <div className="controls">
                    <button 
                        className="btn-outline" 
                        onClick={onRunAnomalies}
                        disabled={!activeConfig.xAxis || !activeConfig.yAxis}
                    >
                        Detect Anomalies
                    </button>
                    <p className="hint">Runs ML to find outliers in active chart data</p>
                </div>
            </div>
        </div>
    );
};

export default ColumnSelector;
