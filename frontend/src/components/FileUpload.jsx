import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setStatus('uploading');
        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('success');
            onUploadSuccess(response.data);
        } catch (err) {
            setStatus('error');
            setError(err.response?.data?.detail || 'Failed to upload file');
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    return (
        <div 
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${status}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
        >
            <input 
                type="file" 
                id="fileInput" 
                hidden 
                onChange={(e) => handleUpload(e.target.files[0])}
                accept=".csv,.xlsx,.xls"
            />
            
            <label htmlFor="fileInput" className="upload-content">
                {status === 'idle' && (
                    <>
                        <Upload size={48} className="icon" />
                        <h3>Click or Drag CSV/Excel to Start</h3>
                        <p>Automatically cleans data and detects types</p>
                    </>
                )}

                {status === 'uploading' && (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p>Parsing & Cleaning Data...</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={48} className="icon success" />
                        <h3>Data Ready!</h3>
                        <button onClick={() => setStatus('idle')} className="btn-small">Upload Another</button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle size={48} className="icon error" />
                        <h3>Upload Failed</h3>
                        <p>{error}</p>
                        <button onClick={() => setStatus('idle')} className="btn-small">Try Again</button>
                    </>
                )}
            </label>
        </div>
    );
};

export default FileUpload;
