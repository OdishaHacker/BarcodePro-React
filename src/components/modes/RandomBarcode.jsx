import React, { useState } from 'react';

export default function RandomBarcode({ onGenerate, showToast }) {
    const [randCount, setRandCount] = useState(20);
    const [randLength, setRandLength] = useState(10);
    const [randPrefix, setRandPrefix] = useState('');
    const [randSuffix, setRandSuffix] = useState('');
    const [randDigits, setRandDigits] = useState(true);
    const [randUpper, setRandUpper] = useState(true);
    const [randLower, setRandLower] = useState(false);
    const [randSymbols, setRandSymbols] = useState(false);

    const handleGenerate = () => {
        const count = parseInt(randCount) || 20;
        const length = parseInt(randLength) || 10;
        let charset = '';
        if (randDigits) charset += '0123456789';
        if (randUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (randLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (randSymbols) charset += '!@#$%&*';

        if (charset.length === 0) {
            showToast('⚠️ Select at least one character set');
            return;
        }

        const codes = [];
        for (let c = 0; c < count; c++) {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += charset[Math.floor(Math.random() * charset.length)];
            }
            codes.push(randPrefix + code + randSuffix);
        }
        onGenerate(codes);
    };

    return (
        <div className="input-section active">
            <div className="random-grid">
                <div className="config-field">
                    <label>How Many?</label>
                    <input type="number" value={randCount} onChange={e => setRandCount(e.target.value)} min="1" max="500" />
                </div>
                <div className="config-field">
                    <label>Code Length</label>
                    <input type="number" value={randLength} onChange={e => setRandLength(e.target.value)} min="1" max="50" />
                </div>
                <div className="config-field">
                    <label>Prefix (optional)</label>
                    <input type="text" value={randPrefix} onChange={e => setRandPrefix(e.target.value)} placeholder="e.g. RND-" />
                </div>
                <div className="config-field">
                    <label>Suffix (optional)</label>
                    <input type="text" value={randSuffix} onChange={e => setRandSuffix(e.target.value)} placeholder="e.g. -X" />
                </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>Character Set</div>
                <div className="char-options">
                    <label className="char-option">
                        <input type="checkbox" checked={randDigits} onChange={e => setRandDigits(e.target.checked)} /> 0-9 (Digits)
                    </label>
                    <label className="char-option">
                        <input type="checkbox" checked={randUpper} onChange={e => setRandUpper(e.target.checked)} /> A-Z (Uppercase)
                    </label>
                    <label className="char-option">
                        <input type="checkbox" checked={randLower} onChange={e => setRandLower(e.target.checked)} /> a-z (Lowercase)
                    </label>
                    <label className="char-option">
                        <input type="checkbox" checked={randSymbols} onChange={e => setRandSymbols(e.target.checked)} /> Symbols (!@#$)
                    </label>
                </div>
            </div>

            <div className="action-bar">
                <button className="btn btn-generate" onClick={handleGenerate}>🎲 Generate Random</button>
            </div>
        </div>
    );
}
