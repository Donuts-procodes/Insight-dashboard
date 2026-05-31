import React, { useMemo } from 'react';
import { 
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ChartViewer = ({ data, config }) => {
    // Sanitized data for charting
    const chartData = useMemo(() => {
        if (!data || !config.xAxis || !config.yAxis) return [];
        
        return data.map(item => {
            const yValue = parseFloat(String(item[config.yAxis]).replace(/[^0-9.-]+/g, ""));
            return {
                ...item,
                [config.yAxis]: isNaN(yValue) ? 0 : yValue
            };
        });
    }, [data, config.xAxis, config.yAxis]);

    if (!data || !config.xAxis || !config.yAxis) {
        return (
            <div className="chart-placeholder">
                <p>Select axes to generate visualization</p>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="chart-placeholder">
                <p>No valid numeric data found for selected Y-axis</p>
            </div>
        );
    }

    const themeColors = {
        primary: "#8ab4f8",
        secondary: "#c58af9",
        grid: "#3c4043",
        text: "#9e9e9e"
    };

    const renderChart = () => {
        switch (config.chartType) {
            case 'bar':
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1f20', border: '1px solid #3c4043', borderRadius: '8px' }}
                            itemStyle={{ color: '#e3e3e3' }}
                        />
                        <Legend />
                        <Bar dataKey={config.yAxis} fill={themeColors.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                        <XAxis dataKey={config.xAxis} name={config.xAxis} stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis dataKey={config.yAxis} name={config.yAxis} stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            contentStyle={{ backgroundColor: '#1e1f20', border: '1px solid #3c4043', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Scatter name="Data Points" data={chartData} fill={themeColors.secondary} />
                    </ScatterChart>
                );
            default: // line
                return (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1f20', border: '1px solid #3c4043', borderRadius: '8px' }}
                            itemStyle={{ color: '#e3e3e3' }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey={config.yAxis} 
                            stroke={themeColors.primary} 
                            strokeWidth={3} 
                            dot={{ fill: themeColors.primary, strokeWidth: 2, r: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            connectNulls
                        />
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
