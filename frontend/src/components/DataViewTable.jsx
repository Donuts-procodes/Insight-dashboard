import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataViewTable = ({ data, anomalies }) => {
    if (!data || data.length === 0) return null;

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 100;
    
    const columns = Object.keys(data[0]);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = data.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="table-wrapper-inner">
            <div className="table-pagination-header">
                <span className="total-count">Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, data.length)} of {data.length.toLocaleString()} rows</span>
                <div className="pagination-controls">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-btn"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="page-indicator">Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-btn"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

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
                        {currentData.map((row, idx) => {
                            const globalIdx = startIndex + idx;
                            return (
                                <tr 
                                    key={globalIdx} 
                                    className={anomalies && anomalies.includes(globalIdx) ? 'anomaly-row' : ''}
                                >
                                    {columns.map(col => (
                                        <td key={`${globalIdx}-${col}`}>
                                            {row[col] !== null ? String(row[col]) : ''}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataViewTable;
