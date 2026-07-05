import React, { useState, useMemo } from 'react';

export default function SequentialBarcode({ onGenerate, showToast }) {
    const [seqPrefix, setSeqPrefix] = useState('');
    const [seqStart, setSeqStart] = useState(1);
    const [seqEnd, setSeqEnd] = useState(50);
    const [seqStep, setSeqStep] = useState(1);
    const [seqPad, setSeqPad] = useState(4);
    const [seqSuffix, setSeqSuffix] = useState('');

    const seqPreview = useMemo(() => {
        let samples = [];
        let count = 0;
        const start = parseInt(seqStart) || 0;
        const end = parseInt(seqEnd) || 0;
        const step = parseInt(seqStep) || 1;
        const pad = parseInt(seqPad) || 0;

        for (let i = start; i <= end && count < 5; i += step) {
            const num = pad > 0 ? String(i).padStart(pad, '0') : String(i);
            samples.push(seqPrefix + num + seqSuffix);
            count++;
        }
        const total = Math.floor((end - start) / step) + 1;
        if (total > 5) samples.push(`... (${total} total)`);
        return samples.join('  →  ');
    }, [seqPrefix, seqStart, seqEnd, seqStep, seqPad, seqSuffix]);

    const handleGenerate = () => {
        const s = parseInt(seqStart);
        const e = parseInt(seqEnd);
        const st = parseInt(seqStep) || 1;
        const p = parseInt(seqPad) || 0;
        if (isNaN(s) || isNaN(e)) { showToast('⚠️ Enter start and end numbers'); return; }
        if (e < s) { showToast('⚠️ End must be ≥ Start'); return; }
        
        const total = Math.floor((e - s) / st) + 1;
        if (total > 1000) { showToast('⚠️ Max 1000 barcodes.'); return; }
        
        const codes = [];
        for (let i = s; i <= e; i += st) {
            const num = p > 0 ? String(i).padStart(p, '0') : String(i);
            codes.push(seqPrefix + num + seqSuffix);
        }
        onGenerate(codes);
    };

    return (
        <div className="input-section active">
            <div className="seq-grid">
                <div className="config-field">
                    <label>Prefix</label>
                    <input type="text" value={seqPrefix} onChange={e => setSeqPrefix(e.target.value)} placeholder="e.g. INV-" />
                </div>
                <div className="config-field">
                    <label>Start Number</label>
                    <input type="number" value={seqStart} onChange={e => setSeqStart(e.target.value)} min="0" />
                </div>
                <div className="config-field">
                    <label>End Number</label>
                    <input type="number" value={seqEnd} onChange={e => setSeqEnd(e.target.value)} min="0" />
                </div>
                <div className="config-field">
                    <label>Step</label>
                    <input type="number" value={seqStep} onChange={e => setSeqStep(e.target.value)} min="1" max="100" />
                </div>
                <div className="config-field">
                    <label>Zero Padding</label>
                    <select value={seqPad} onChange={e => setSeqPad(e.target.value)}>
                        <option value="0">No padding</option>
                        <option value="3">3 digits</option>
                        <option value="4">4 digits</option>
                        <option value="5">5 digits</option>
                        <option value="6">6 digits</option>
                    </select>
                </div>
                <div className="config-field">
                    <label>Suffix</label>
                    <input type="text" value={seqSuffix} onChange={e => setSeqSuffix(e.target.value)} placeholder="e.g. -A" />
                </div>
            </div>
            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Preview</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{seqPreview}</div>
            </div>
            <div className="action-bar">
                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate Sequence</button>
            </div>
        </div>
    );
}
