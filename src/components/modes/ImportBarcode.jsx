import React, { useState } from 'react';

export default function ImportBarcode({ onGenerate, showToast }) {
    const [importedValues, setImportedValues] = useState([]);
    const [fileName, setFileName] = useState('');
    const [csvColumn, setCsvColumn] = useState('0');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            let values = [];
            const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
            lines.forEach(line => {
                let parts = line.includes(',') ? line.split(',') : line.includes('\t') ? line.split('\t') : line.includes(';') ? line.split(';') : [line];
                parts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));
                if (csvColumn === 'auto') {
                    values.push(parts[0]);
                } else {
                    const idx = parseInt(csvColumn);
                    if (parts[idx]) values.push(parts[idx]);
                    else if (parts[0]) values.push(parts[0]);
                }
            });
            const valid = values.filter(v => v.length > 0);
            setImportedValues(valid);
            setFileName(`📄 ${file.name} — ${valid.length} values found`);
            showToast(`📄 Loaded ${valid.length} values from ${file.name}`);
        };
        reader.readAsText(file);
    };

    const handleGenerate = () => {
        if (importedValues.length === 0) {
            showToast('⚠️ Please upload a file first');
            return;
        }
        onGenerate([...importedValues]);
    };

    return (
        <div className="input-section active">
            <div className="drop-zone">
                <input type="file" accept=".csv,.txt,.tsv" onChange={handleFileSelect} />
                <div className="drop-zone-icon">📁</div>
                <div className="drop-zone-text">Click to browse file or Drag & Drop</div>
                {fileName && <div className="file-name" style={{ display: 'inline-flex' }}>{fileName}</div>}
            </div>
            
            <div style={{ marginTop: '16px' }}>
                <div className="config-field">
                    <label>Column to use (for CSV)</label>
                    <select value={csvColumn} onChange={e => setCsvColumn(e.target.value)}>
                        <option value="0">Column 1 (first)</option>
                        <option value="1">Column 2</option>
                        <option value="2">Column 3</option>
                        <option value="3">Column 4</option>
                        <option value="auto">Auto-detect</option>
                    </select>
                </div>
            </div>

            <div className="action-bar">
                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate from File</button>
            </div>
        </div>
    );
}
