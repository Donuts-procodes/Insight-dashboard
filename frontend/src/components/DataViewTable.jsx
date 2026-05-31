import React from 'react';

const DataViewTable = ({ data, anomalies }) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const maxRows = 1000;
    const isTruncated = data.length > maxRows;
    const displayData = isTruncated ? data.slice(0, maxRows) : data;

    return (
        <div className="table-container">
            {isTruncated && (
                <div className="table-warning">
                    ⚠️ Showing first {maxRows} rows out of {data.length.toLocaleString()} to ensure performance.
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((row, idx) => (
                        <tr 
                            key={idx} 
                            className={anomalies && anomalies.includes(idx) ? 'anomaly-row' : ''}
                        >
                            {columns.map(col => (
                                <td key={`${idx}-${col}`}>{row[col] !== null ? String(row[col]) : ''}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataViewTable;
