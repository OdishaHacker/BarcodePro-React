import React, { useState } from 'react';

export default function BulkBarcode({ onGenerate, showToast }) {
    const [bulkTextarea, setBulkTextarea] = useState('');
    const [rangePrefix, setRangePrefix] = useState('');
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');

    const handleGenerate = () => {
        let codes = [];
        if (bulkTextarea.trim()) {
            codes = bulkTextarea.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        } else {
            const s = parseInt(rangeStart);
            const e = parseInt(rangeEnd);
            if (isNaN(s) || isNaN(e)) { showToast('⚠️ Enter values or fill range fields'); return; }
            if (e < s) { showToast('⚠️ End must be ≥ Start'); return; }
            if (e - s > 999) { showToast('⚠️ Max 1000 barcodes at a time'); return; }
            for (let i = s; i <= e; i++) codes.push(rangePrefix + i);
        }
        onGenerate(codes);
    };

    const clearAll = () => {
        setBulkTextarea('');
        setRangePrefix('');
        setRangeStart('');
        setRangeEnd('');
    };

    return (
        <div className="input-section active">
            <textarea 
                className="bulk-textarea" 
                value={bulkTextarea} 
                onChange={e => setBulkTextarea(e.target.value)} 
                placeholder="ABC-001&#10;ABC-002&#10;...paste multiple values, one per line"
            ></textarea>
            <div className="or-divider">OR USE RANGE</div>
            <div className="range-row">
                <div className="config-field">
                    <label>Prefix</label>
                    <input type="text" value={rangePrefix} onChange={e => setRangePrefix(e.target.value)} placeholder="e.g. K100" />
                </div>
                <div className="config-field">
                    <label>Start</label>
                    <input type="number" value={rangeStart} onChange={e => setRangeStart(e.target.value)} placeholder="100" />
                </div>
                <div className="config-field">
                    <label>End</label>
                    <input type="number" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} placeholder="150" />
                </div>
            </div>
            <div className="action-bar">
                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate Barcodes</button>
                <button className="btn btn-outline" onClick={clearAll}>🗑️ Clear</button>
            </div>
        </div>
    );
}
