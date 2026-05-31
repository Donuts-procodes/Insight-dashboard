import React, { useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const DataViewTable = ({ data, anomalies }) => {
    const headerRef = useRef(null);
    
    if (!data || data.length === 0) return null;

    const columns = useMemo(() => Object.keys(data[0]), [data]);
    const columnWidth = 180; // Professional wider columns
    const rowWidth = columns.length * columnWidth;

    const onScroll = ({ scrollLeft }) => {
        if (headerRef.current) {
            headerRef.current.scrollLeft = scrollLeft;
        }
    };

    const Row = ({ index, style }) => {
        const row = data[index];
        const isAnomaly = anomalies && anomalies.includes(index);
        
        return (
            <div 
                style={{ 
                    ...style, 
                    display: 'flex', 
                    width: rowWidth,
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
                            borderRight: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.85rem'
                        }}
                    >
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="table-wrapper-virtual" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Synchronized Header */}
            <div 
                ref={headerRef}
                className="table-header-virtual" 
                style={{ 
                    display: 'flex', 
                    overflow: 'hidden',
                    background: '#28292a',
                    borderBottom: '1px solid var(--border)',
                    zIndex: 10
                }}
            >
                <div style={{ display: 'flex', width: rowWidth }}>
                    {columns.map(col => (
                        <div 
                            key={col} 
                            style={{ 
                                width: columnWidth, 
                                padding: '1rem',
                                fontWeight: '600',
                                color: 'var(--text-light)',
                                borderRight: '1px solid var(--border)',
                                flexShrink: 0,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {col}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Virtualized Body */}
            <div className="table-body-virtual" style={{ flex: 1 }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            itemCount={data.length}
                            itemSize={45}
                            width={width}
                            onScroll={onScroll}
                            className="virtual-list-container"
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default DataViewTable;
