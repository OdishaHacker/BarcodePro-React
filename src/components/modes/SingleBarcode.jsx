import React, { useState } from 'react';

export default function SingleBarcode({ onGenerate, showToast }) {
    const [singleInput, setSingleInput] = useState('');

    const handleGenerate = () => {
        if (!singleInput.trim()) {
            showToast('⚠️ Please enter a value');
            return;
        }
        onGenerate([singleInput.trim()]);
    };

    return (
        <div className="input-section active">
            <div className="single-input-wrap">
                <input 
                    type="text" 
                    value={singleInput} 
                    onChange={e => setSingleInput(e.target.value)} 
                    placeholder="Enter barcode value, e.g. K1001031007" 
                    onKeyDown={e => e.key === 'Enter' && handleGenerate()} 
                />
                <button className="btn btn-generate" onClick={handleGenerate}>Generate</button>
            </div>
        </div>
    );
}
