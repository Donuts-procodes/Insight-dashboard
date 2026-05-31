import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const DataViewTable = ({ data, anomalies }) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const columnWidth = 150; // Minimum width per column

    const Row = ({ index, style }) => {
        const row = data[index];
        const isAnomaly = anomalies && anomalies.includes(index);
        
        return (
            <div 
                style={{ 
                    ...style, 
                    display: 'flex', 
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: isAnomaly ? 'var(--anomaly)' : 'transparent'
                }} 
                className="table-row-virtual"
            >
                {columns.map(col => (
                    <div 
                        key={`${index}-${col}`} 
                        style={{ 
                            width: columnWidth, 
                            padding: '0.75rem 1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            borderRight: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        {row[col] !== null ? String(row[col]) : ''}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="table-wrapper-virtual">
            <div className="table-header-virtual" style={{ display: 'flex', width: columns.length * columnWidth }}>
                {columns.map(col => (
                    <div 
                        key={col} 
                        style={{ 
                            width: columnWidth, 
                            padding: '1rem',
                            background: '#28292a',
                            fontWeight: '600',
                            color: 'var(--text-light)',
                            borderRight: '1px solid var(--border)',
                            flexShrink: 0
                        }}
                    >
                        {col}
                    </div>
                ))}
            </div>
            <div className="table-body-virtual" style={{ flex: 1 }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            itemCount={data.length}
                            itemSize={45}
                            width={width}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

// Simple AutoSizer wrapper if the library isn't installed, but we'll try to use a standard div approach if needed.
// For now, let's assume we want a robust solution and I'll add the necessary logic.

export default DataViewTable;
