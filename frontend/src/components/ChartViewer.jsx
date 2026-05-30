import React from 'react';
import { 
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ChartViewer = ({ data, config }) => {
    if (!data || !config.xAxis || !config.yAxis) {
        return (
            <div className="chart-placeholder">
                <p>Select axes or ask the AI to generate a chart</p>
            </div>
        );
    }

    const renderChart = () => {
        switch (config.chartType) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={config.yAxis} fill="#3b82f6" />
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} name={config.xAxis} />
                        <YAxis dataKey={config.yAxis} name={config.yAxis} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter name="Data Points" data={data} fill="#3b82f6" />
                    </ScatterChart>
                );
            default: // line
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={config.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={config.yAxis} stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                );
        }
    };

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default ChartViewer;
