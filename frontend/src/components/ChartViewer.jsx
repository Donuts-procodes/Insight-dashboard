import React, { useMemo } from 'react';
import { 
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ChartViewer = ({ data, config }) => {
    const themeColors = {
        primary: "#8ab4f8",
        secondary: "#c58af9",
        grid: "#3c4043",
        text: "#9e9e9e",
        pie: ["#8ab4f8", "#c58af9", "#81c995", "#f28b82", "#fdd663"]
    };

    const chartData = useMemo(() => {
        if (!data || !config.xAxis || !config.yAxis) return [];
        
        // Special processing for Pie Chart (Category counts on Y-Axis)
        if (config.chartType === 'pie') {
            const counts = {};
            data.forEach(item => {
                const val = String(item[config.yAxis] || 'Unknown');
                counts[val] = (counts[val] || 0) + 1;
            });
            return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 10);
        }

        // Standard numeric sanitization for other charts
        return data.map(item => {
            const yRaw = String(item[config.yAxis] || "0");
            const yValue = parseFloat(yRaw.replace(/[^0-9.-]+/g, ""));
            return {
                ...item,
                [config.yAxis]: isNaN(yValue) ? 0 : yValue
            };
        });
    }, [data, config.xAxis, config.yAxis, config.chartType]);

    if (!data || !config.xAxis || !config.yAxis) {
        return (
            <div className="chart-placeholder">
                <p>Select axes to generate visualization</p>
            </div>
        );
    }

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 30, left: 0, bottom: 0 }
        };

        switch (config.chartType) {
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke={themeColors.text} fontSize={11} tickLine={false} />
                        <YAxis stroke={themeColors.text} fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e1f20', border: 'none', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey={config.yAxis} stroke={themeColors.primary} fillOpacity={1} fill="url(#colorArea)" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke={themeColors.text} fontSize={11} />
                        <YAxis stroke={themeColors.text} fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e1f20', border: 'none' }} />
                        <Bar dataKey={config.yAxis} fill={themeColors.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={themeColors.pie[index % themeColors.pie.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e1f20', border: 'none' }} />
                        <Legend />
                    </PieChart>
                );
            case 'scatter':
                return (
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke={themeColors.grid} />
                        <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} stroke={themeColors.text} fontSize={11} />
                        <YAxis type="number" dataKey={config.yAxis} name={config.yAxis} stroke={themeColors.text} fontSize={11} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e1f20', border: 'none' }} />
                        <Scatter name="Data Points" data={chartData} fill={themeColors.secondary} />
                    </ScatterChart>
                );
            default: // line
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke={themeColors.text} fontSize={11} />
                        <YAxis stroke={themeColors.text} fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e1f20', border: 'none' }} />
                        <Line type="monotone" dataKey={config.yAxis} stroke={themeColors.primary} strokeWidth={2} dot={false} />
                    </LineChart>
                );
        }
    };

    return (
        <div className="chart-container" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default ChartViewer;
