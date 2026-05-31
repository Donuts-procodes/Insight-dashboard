import React from 'react';
import { Target, BarChart2 } from 'lucide-react';

const ColumnSelector = ({ schema, config, setConfig, onRunAnomalies }) => {
    const handleAxisChange = (axis, value) => {
        setConfig(prev => ({ ...prev, [axis]: value }));
    };

    return (
        <div className="column-selector">
            <div className="selection-group">
                <h4><BarChart2 size={18} /> Chart Settings</h4>
                <div className="controls">
                    <select 
                        value={config.xAxis} 
                        onChange={(e) => handleAxisChange('xAxis', e.target.value)}
                    >
                        <option value="">Select X Axis</option>
                        {schema.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>

                    <select 
                        value={config.yAxis} 
                        onChange={(e) => handleAxisChange('yAxis', e.target.value)}
                    >
                        <option value="">Select Y Axis</option>
                        {schema.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>

                    <select 
                        value={config.chartType} 
                        onChange={(e) => handleAxisChange('chartType', e.target.value)}
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="area">Area Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="pie">Pie Chart (Y-Axis Categories)</option>
                    </select>
                </div>
            </div>

            <div className="selection-group">
                <h4><Target size={18} /> Anomaly Detection</h4>
                <div className="controls">
                    <button 
                        className="btn-primary" 
                        onClick={onRunAnomalies}
                        disabled={!config.xAxis || !config.yAxis}
                    >
                        Run AI Scan
                    </button>
                    <p className="hint">Analyzes selected axes for statistical outliers</p>
                </div>
            </div>
        </div>
    );
};

export default ColumnSelector;
