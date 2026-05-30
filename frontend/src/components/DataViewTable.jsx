import React from 'react';

const DataViewTable = ({ data, anomalies }) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 50).map((row, idx) => (
                        <tr 
                            key={idx} 
                            className={anomalies.includes(idx) ? 'anomaly-row' : ''}
                        >
                            {columns.map(col => (
                                <td key={`${idx}-${col}`}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length > 50 && (
                <p className="table-footer">Showing first 50 of {data.length} rows</p>
            )}
        </div>
    );
};

export default DataViewTable;
