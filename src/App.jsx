import React, { useState, useEffect, useRef, useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import qrcode from 'qrcode-generator';
import './index.css';

// --- Type Info Map ---
const typeInfoMap = {
    CODE128: { icon: '📦', text: '<strong>Code 128</strong> — Most versatile barcode. Supports all ASCII characters (A-Z, a-z, 0-9, symbols). Used in shipping, logistics, inventory. No length restriction.' },
    CODE39:  { icon: '🏷️', text: '<strong>Code 39</strong> — Supports A-Z (uppercase), 0-9, and symbols (-, ., $, /, +, %, space). Popular in automotive, defense, healthcare.' },
    EAN13:  { icon: '🛒', text: '<strong>EAN-13</strong> — 13-digit product barcode used worldwide on retail items. Must be exactly 12 digits (13th is checksum). Example: 590123412345' },
    EAN8:   { icon: '📏', text: '<strong>EAN-8</strong> — Compact 8-digit version of EAN-13 for small products. Must be exactly 7 digits (8th is checksum). Example: 9638507' },
    EAN5:   { icon: '📰', text: '<strong>EAN-5</strong> — 5-digit supplement barcode, usually used with ISBN on books for price. Must be exactly 5 digits.' },
    EAN2:   { icon: '📖', text: '<strong>EAN-2</strong> — 2-digit supplement barcode for periodicals (magazine issue numbers). Must be exactly 2 digits.' },
    UPC:    { icon: '🇺🇸', text: '<strong>UPC-A</strong> — 12-digit barcode standard in USA/Canada for retail products. Must be exactly 11 digits (12th is checksum). Example: 01234567890' },
    ITF14:  { icon: '📦', text: '<strong>ITF-14</strong> — 14-digit barcode for shipping cartons and pallets. Must be exactly 13 digits (14th is checksum). Example: 1234567890123' },
    ITF:    { icon: '📐', text: '<strong>ITF (Interleaved 2 of 5)</strong> — Numeric only, must have even number of digits. Used in distribution and warehouse management.' },
    MSI:    { icon: '🏪', text: '<strong>MSI</strong> — Numeric barcode for inventory, warehouse shelves, and storage. Supports digits 0-9 only.' },
    MSI10:  { icon: '🏪', text: '<strong>MSI Mod 10</strong> — MSI barcode with Mod 10 check digit appended automatically. Numeric only.' },
    MSI11:  { icon: '🏪', text: '<strong>MSI Mod 11</strong> — MSI barcode with Mod 11 check digit. Numeric only.' },
    MSI1010:{ icon: '🏪', text: '<strong>MSI Mod 10/10</strong> — MSI barcode with double Mod 10 check digits. Numeric only.' },
    MSI1110:{ icon: '🏪', text: '<strong>MSI Mod 11/10</strong> — MSI barcode with Mod 11 + Mod 10 check digits. Numeric only.' },
    pharmacode: { icon: '💊', text: '<strong>Pharmacode</strong> — Used in pharmaceutical packaging. Numeric only, value must be between 3 and 131070. Very compact.' },
    codabar:{ icon: '🩸', text: '<strong>Codabar</strong> — Used in libraries, blood banks, and FedEx airbills. Supports 0-9, -, $, :, /, ., + and start/stop characters A-D.' },
    QR:     { icon: '📱', text: '<strong>QR Code</strong> — 2D barcode scannable by any smartphone camera. Supports text, URLs, numbers, and any character. Up to 4,296 characters.' }
};

const unitToPx = { px: 1, mm: 3.7795, cm: 37.795, inch: 96, pt: 1.333 };
const convertToPx = (value, unit) => Math.round(value * (unitToPx[unit] || 1));

// --- Barcode Item Component ---
const BarcodeItem = ({ code, index, config, isPrint = false }) => {
    const svgRef = useRef(null);
    const [error, setError] = useState(null);

    const isQR = config.barcodeType === 'QR';

    const getBarWidthPx = () => {
        const val = parseFloat(config.barWidth) || 2;
        return config.globalUnit === 'px' ? val : convertToPx(val, config.globalUnit) / 40;
    };

    const getBarHeightPx = () => {
        const val = parseFloat(config.barHeight) || 55;
        return convertToPx(val, config.globalUnit);
    };
    
    const getQrSizePx = () => {
        const val = parseFloat(config.qrSize) || 6;
        return convertToPx(val, config.globalUnit);
    };

    useEffect(() => {
        if (!isQR && svgRef.current) {
            try {
                JsBarcode(svgRef.current, code, {
                    format: config.barcodeType,
                    width: getBarWidthPx(),
                    height: getBarHeightPx(),
                    displayValue: config.showText,
                    fontSize: parseInt(config.fontSize) || 14,
                    font: config.fontFamily,
                    fontOptions: config.boldText ? 'bold' : '',
                    textMargin: parseInt(config.textMargin) || 6,
                    textPosition: config.textPosition,
                    textAlign: 'center',
                    margin: 0,
                    background: isPrint ? '#ffffff' : 'transparent',
                    lineColor: isPrint ? '#000000' : '#e8e8f0'
                });
                setError(null);
            } catch (e) {
                setError(`Invalid for ${config.barcodeType}: "${code}"`);
            }
        }
    }, [code, config, isPrint, isQR]);

    if (isQR) {
        let imgTag = '';
        try {
            const qr = qrcode(0, 'M');
            qr.addData(code);
            qr.make();
            imgTag = qr.createImgTag(getQrSizePx(), 0);
            setError(null);
        } catch(e) {
            setError(`QR Error: "${code}"`);
        }

        return (
            <div className={`barcode-card ${isPrint ? (config.showBorder ? 'with-border' : 'no-border') : ''}`}>
                {!isPrint && <span className="card-index">#{index + 1}</span>}
                {error ? (
                    <p style={{ color: '#ff5050', fontSize: '0.8rem', padding: '12px' }}>❌ {error}</p>
                ) : (
                    <>
                        <div 
                            dangerouslySetInnerHTML={{ __html: imgTag }} 
                            style={{ filter: isPrint ? 'none' : 'invert(1)', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                            className="qr-wrapper"
                        />
                        {config.showText && (
                            <div style={{ fontSize: '0.78rem', color: isPrint ? '#000' : 'var(--text-secondary)', marginTop: '10px', fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all' }}>
                                {code}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`barcode-card ${isPrint ? (config.showBorder ? 'with-border' : 'no-border') : ''}`}>
            {!isPrint && <span className="card-index">#{index + 1}</span>}
            {error ? (
                <p style={{ color: '#ff5050', fontSize: '0.8rem', padding: '12px' }}>❌ {error}</p>
            ) : (
                <svg ref={svgRef}></svg>
            )}
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [toast, setToast] = useState({ msg: '', show: false });
    const showToast = (msg) => {
        setToast({ msg, show: true });
        setTimeout(() => setToast({ msg: '', show: false }), 2500);
    };

    const [config, setConfig] = useState({
        barcodeType: 'CODE128',
        colCount: '3',
        perPage: 15,
        perPageAll: false,
        barWidth: 2,
        barHeight: 55,
        qrSize: 6,
        globalUnit: 'px',
        fontFamily: 'Inter',
        fontSize: 14,
        textMargin: 6,
        textPosition: 'bottom',
        hGap: 16,
        vGap: 16,
        showText: true,
        boldText: false,
        showBorder: true,
    });

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const isQR = config.barcodeType === 'QR';
    const typeInfo = typeInfoMap[config.barcodeType];

    const [currentMode, setCurrentMode] = useState('single');
    
    // Single
    const [singleInput, setSingleInput] = useState('');
    
    // Bulk
    const [bulkTextarea, setBulkTextarea] = useState('');
    const [rangePrefix, setRangePrefix] = useState('');
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');

    // Sequential
    const [seqPrefix, setSeqPrefix] = useState('');
    const [seqStart, setSeqStart] = useState(1);
    const [seqEnd, setSeqEnd] = useState(50);
    const [seqStep, setSeqStep] = useState(1);
    const [seqPad, setSeqPad] = useState(4);
    const [seqSuffix, setSeqSuffix] = useState('');

    // Import
    const [importedValues, setImportedValues] = useState([]);
    const [fileName, setFileName] = useState('');
    const [csvColumn, setCsvColumn] = useState('0');

    // Random
    const [randCount, setRandCount] = useState(20);
    const [randLength, setRandLength] = useState(10);
    const [randPrefix, setRandPrefix] = useState('');
    const [randSuffix, setRandSuffix] = useState('');
    const [randDigits, setRandDigits] = useState(true);
    const [randUpper, setRandUpper] = useState(true);
    const [randLower, setRandLower] = useState(false);
    const [randSymbols, setRandSymbols] = useState(false);

    const [allCodes, setAllCodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

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


    const generateRandomCodes = () => {
        const count = parseInt(randCount) || 20;
        const length = parseInt(randLength) || 10;
        let charset = '';
        if (randDigits) charset += '0123456789';
        if (randUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (randLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (randSymbols) charset += '!@#$%&*';

        if (charset.length === 0) {
            showToast('⚠️ Select at least one character set');
            return [];
        }

        const codes = [];
        for (let c = 0; c < count; c++) {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += charset[Math.floor(Math.random() * charset.length)];
            }
            codes.push(randPrefix + code + randSuffix);
        }
        return codes;
    };

    const handleGenerate = () => {
        let codes = [];
        switch (currentMode) {
            case 'single':
                if (!singleInput.trim()) { showToast('⚠️ Please enter a value'); return; }
                codes = [singleInput.trim()];
                break;
            case 'bulk':
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
                break;
            case 'sequential':
                const s = parseInt(seqStart);
                const e = parseInt(seqEnd);
                const st = parseInt(seqStep) || 1;
                const p = parseInt(seqPad) || 0;
                if (isNaN(s) || isNaN(e)) { showToast('⚠️ Enter start and end numbers'); return; }
                if (e < s) { showToast('⚠️ End must be ≥ Start'); return; }
                const total = Math.floor((e - s) / st) + 1;
                if (total > 1000) { showToast('⚠️ Max 1000 barcodes.'); return; }
                for (let i = s; i <= e; i += st) {
                    const num = p > 0 ? String(i).padStart(p, '0') : String(i);
                    codes.push(seqPrefix + num + seqSuffix);
                }
                break;
            case 'import':
                if (importedValues.length === 0) { showToast('⚠️ Please upload a file first'); return; }
                codes = [...importedValues];
                break;
            case 'random':
                codes = generateRandomCodes();
                break;
        }

        if (codes.length === 0) return;

        setAllCodes(codes);
        setCurrentPage(1);
        showToast(`✅ ${codes.length} barcode${codes.length > 1 ? 's' : ''} generated!`);
        
        setTimeout(() => {
             document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

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

    const clearAll = () => {
        setBulkTextarea(''); setRangePrefix(''); setRangeStart(''); setRangeEnd(''); setSingleInput('');
    };

    const resetAll = () => {
        clearAll();
        setAllCodes([]); setImportedValues([]); setFileName('');
        setConfig({
            barcodeType: 'CODE128', colCount: '3', perPage: 15, perPageAll: false,
            barWidth: 2, barHeight: 55, qrSize: 6, globalUnit: 'px', fontFamily: 'Inter',
            fontSize: 14, textMargin: 6, textPosition: 'bottom', hGap: 16, vGap: 16,
            showText: true, boldText: false, showBorder: true,
        });
        setCurrentMode('single');
        showToast('🔄 Reset complete');
    };

    // Print Logic
    const printBarcodes = () => {
        if (allCodes.length === 0) return;
        window.print();
    };

    // Download Logic (Simplified Canvas approach)
    const downloadAllPNG = () => {
        showToast('⚠️ Download logic requires html2canvas or similar in React. Print is recommended.');
        // For full fidelity download, you'd integrate dom-to-image or html2canvas here.
    };

    const actualPerPage = config.perPageAll ? allCodes.length : (parseInt(config.perPage) || 15);
    const totalPages = Math.ceil(allCodes.length / actualPerPage) || 1;
    const paginatedCodes = allCodes.slice((currentPage - 1) * actualPerPage, currentPage * actualPerPage);

    return (
        <div className="app-wrapper">
            <nav className="navbar">
                <a className="navbar-brand" href="#">
                    <div className="navbar-logo">B</div>
                    <div className="navbar-title">Barcode<span>Pro</span></div>
                </a>
                <div className="navbar-actions">
                    <button className="btn btn-outline btn-sm" onClick={resetAll}>🔄 Reset</button>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-badge">⚡ Professional Tool</div>
                <h1>Generate Any <span className="gradient-text">Barcode & QR Code</span></h1>
                <p>Single, Bulk, Sequential, Import, or Random — create, preview, and print any barcode type with full control.</p>
            </section>

            <div className="main-container">
                <div className="config-panel">
                    <div className="config-header">
                        <div className="config-icon">⚙️</div>
                        <div>
                            <div className="config-title">Configuration</div>
                            <div className="config-subtitle">Choose barcode type, layout, and display options</div>
                        </div>
                    </div>

                    <div className="config-grid">
                        <div className="config-field">
                            <label>Barcode Type</label>
                            <select value={config.barcodeType} onChange={e => updateConfig('barcodeType', e.target.value)}>
                                <optgroup label="── Linear (1D) Barcodes ──">
                                    <option value="CODE128">Code 128 — Alphanumeric</option>
                                    <option value="CODE39">Code 39 — A-Z, 0-9</option>
                                    <option value="EAN13">EAN-13 — 13 digit product</option>
                                    <option value="EAN8">EAN-8 — 8 digit compact</option>
                                    <option value="EAN5">EAN-5 — 5 digit supplement</option>
                                    <option value="EAN2">EAN-2 — 2 digit supplement</option>
                                    <option value="UPC">UPC-A — 12 digit US product</option>
                                    <option value="ITF14">ITF-14 — 14 digit shipping</option>
                                    <option value="ITF">ITF — Interleaved 2 of 5</option>
                                    <option value="MSI">MSI — Numeric warehouse</option>
                                    <option value="MSI10">MSI Mod 10</option>
                                    <option value="MSI11">MSI Mod 11</option>
                                    <option value="MSI1010">MSI Mod 10/10</option>
                                    <option value="MSI1110">MSI Mod 11/10</option>
                                    <option value="pharmacode">Pharmacode — Pharma packs</option>
                                    <option value="codabar">Codabar — Libraries, blood banks</option>
                                </optgroup>
                                <optgroup label="── 2D Barcodes ──">
                                    <option value="QR">QR Code — Scan with phone</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="config-field">
                            <label>Columns Per Row</label>
                            <select value={config.colCount} onChange={e => updateConfig('colCount', e.target.value)}>
                                <option value="1">1 Column</option>
                                <option value="2">2 Columns</option>
                                <option value="3">3 Columns</option>
                                <option value="4">4 Columns</option>
                                <option value="5">5 Columns</option>
                            </select>
                        </div>
                        <div className="config-field">
                            <label>Barcodes Per Page</label>
                            <div className="per-page-row">
                                <input type="number" value={config.perPage} disabled={config.perPageAll} style={{ opacity: config.perPageAll ? 0.4 : 1 }} min="1" max="500" onChange={e => updateConfig('perPage', e.target.value)} />
                                <label className="all-check">
                                    <input type="checkbox" checked={config.perPageAll} onChange={e => updateConfig('perPageAll', e.target.checked)} />
                                    All on one page
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="size-controls">
                        <div className="section-label"><span className="label-icon">📐</span> Barcode Size</div>
                        
                        {!isQR && (
                            <>
                                <div className="config-field">
                                    <label>Width</label>
                                    <input type="number" value={config.barWidth} step="0.5" onChange={e => updateConfig('barWidth', e.target.value)} />
                                </div>
                                <div className="config-field">
                                    <label>Height</label>
                                    <input type="number" value={config.barHeight} onChange={e => updateConfig('barHeight', e.target.value)} />
                                </div>
                            </>
                        )}
                        {isQR && (
                            <div className="config-field">
                                <label>QR Module Size</label>
                                <input type="number" value={config.qrSize} min="2" max="20" onChange={e => updateConfig('qrSize', e.target.value)} />
                            </div>
                        )}
                        <div className="config-field">
                            <label>Measurement Unit</label>
                            <select value={config.globalUnit} onChange={e => updateConfig('globalUnit', e.target.value)}>
                                <option value="px">px</option>
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="inch">inch</option>
                                <option value="pt">pt</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                        <div className="size-controls">
                            <div className="section-label"><span className="label-icon">🔤</span> Fonts</div>
                            <div className="config-field">
                                <label>Font Family</label>
                                <select value={config.fontFamily} onChange={e => updateConfig('fontFamily', e.target.value)}>
                                    <option value="Inter">Inter (Default)</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                </select>
                            </div>
                            <div className="config-field">
                                <label>Font Size (px)</label>
                                <input type="number" value={config.fontSize} onChange={e => updateConfig('fontSize', e.target.value)} />
                            </div>
                            <div className="config-field">
                                <label>Text Gap ({config.textMargin}px)</label>
                                <input type="range" value={config.textMargin} min="0" max="50" onChange={e => updateConfig('textMargin', e.target.value)} />
                            </div>
                            <div className="config-field">
                                <label>Text Position</label>
                                <select value={config.textPosition} onChange={e => updateConfig('textPosition', e.target.value)}>
                                    <option value="bottom">Bottom</option>
                                    <option value="top">Top</option>
                                </select>
                            </div>
                        </div>
                        <div className="size-controls">
                            <div className="section-label"><span className="label-icon">↔️</span> Barcode Spacing</div>
                            <div className="config-field">
                                <label>Horizontal Gap (px)</label>
                                <input type="number" value={config.hGap} onChange={e => updateConfig('hGap', e.target.value)} />
                            </div>
                            <div className="config-field">
                                <label>Vertical Gap (px)</label>
                                <input type="number" value={config.vGap} onChange={e => updateConfig('vGap', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {typeInfo && (
                        <div className="type-info">
                            <span className="info-icon">{typeInfo.icon}</span>
                            <div dangerouslySetInnerHTML={{ __html: typeInfo.text }}></div>
                        </div>
                    )}

                    <div className="toggle-row">
                        <label className="toggle-item">
                            <input type="checkbox" checked={config.showText} onChange={e => updateConfig('showText', e.target.checked)} />
                            <div className="toggle-switch"></div>
                            <div>
                                <div className="toggle-label">Show Text</div>
                                <div className="toggle-desc">Display value below barcode</div>
                            </div>
                        </label>
                        <label className="toggle-item">
                            <input type="checkbox" checked={config.boldText} onChange={e => updateConfig('boldText', e.target.checked)} />
                            <div className="toggle-switch"></div>
                            <div>
                                <div className="toggle-label">Bold Text</div>
                                <div className="toggle-desc">Make text bolder</div>
                            </div>
                        </label>
                        <label className="toggle-item">
                            <input type="checkbox" checked={config.showBorder} onChange={e => updateConfig('showBorder', e.target.checked)} />
                            <div className="toggle-switch"></div>
                            <div>
                                <div className="toggle-label">Show Border</div>
                                <div className="toggle-desc">Card border in print</div>
                            </div>
                        </label>
                    </div>

                    <div className="mode-tabs">
                        {['single', 'bulk', 'sequential', 'import', 'random'].map(m => (
                            <button key={m} className={`mode-tab ${currentMode === m ? 'active' : ''}`} onClick={() => setCurrentMode(m)}>
                                {m === 'single' && '📌 Single'}
                                {m === 'bulk' && '📦 Bulk'}
                                {m === 'sequential' && '📋 Sequential'}
                                {m === 'import' && '📁 Import'}
                                {m === 'random' && '🎲 Random'}
                            </button>
                        ))}
                    </div>

                    {currentMode === 'single' && (
                        <div className="input-section active">
                            <div className="single-input-wrap">
                                <input type="text" value={singleInput} onChange={e => setSingleInput(e.target.value)} placeholder="Enter barcode value" onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
                                <button className="btn btn-generate" onClick={handleGenerate}>Generate</button>
                            </div>
                        </div>
                    )}

                    {currentMode === 'bulk' && (
                        <div className="input-section active">
                            <textarea className="bulk-textarea" value={bulkTextarea} onChange={e => setBulkTextarea(e.target.value)} placeholder="ABC-001&#10;ABC-002"></textarea>
                            <div className="or-divider">OR USE RANGE</div>
                            <div className="range-row">
                                <div className="config-field">
                                    <label>Prefix</label>
                                    <input type="text" value={rangePrefix} onChange={e => setRangePrefix(e.target.value)} />
                                </div>
                                <div className="config-field">
                                    <label>Start</label>
                                    <input type="number" value={rangeStart} onChange={e => setRangeStart(e.target.value)} />
                                </div>
                                <div className="config-field">
                                    <label>End</label>
                                    <input type="number" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} />
                                </div>
                            </div>
                            <div className="action-bar">
                                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate Barcodes</button>
                                <button className="btn btn-outline" onClick={clearAll}>🗑️ Clear</button>
                            </div>
                        </div>
                    )}

                    {currentMode === 'sequential' && (
                        <div className="input-section active">
                            <div className="seq-grid">
                                <div className="config-field"><label>Prefix</label><input type="text" value={seqPrefix} onChange={e => setSeqPrefix(e.target.value)} /></div>
                                <div className="config-field"><label>Start Number</label><input type="number" value={seqStart} onChange={e => setSeqStart(e.target.value)} /></div>
                                <div className="config-field"><label>End Number</label><input type="number" value={seqEnd} onChange={e => setSeqEnd(e.target.value)} /></div>
                                <div className="config-field"><label>Step</label><input type="number" value={seqStep} onChange={e => setSeqStep(e.target.value)} /></div>
                                <div className="config-field">
                                    <label>Zero Padding</label>
                                    <select value={seqPad} onChange={e => setSeqPad(e.target.value)}>
                                        <option value="0">No padding</option>
                                        <option value="3">3 digits</option>
                                        <option value="4">4 digits</option>
                                        <option value="6">6 digits</option>
                                    </select>
                                </div>
                                <div className="config-field"><label>Suffix</label><input type="text" value={seqSuffix} onChange={e => setSeqSuffix(e.target.value)} /></div>
                            </div>
                            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Preview</div>
                                <div style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{seqPreview}</div>
                            </div>
                            <div className="action-bar">
                                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate Sequence</button>
                            </div>
                        </div>
                    )}

                    {currentMode === 'import' && (
                        <div className="input-section active">
                            <div className="drop-zone">
                                <input type="file" accept=".csv,.txt,.tsv" onChange={handleFileSelect} />
                                <div className="drop-zone-icon">📁</div>
                                <div className="drop-zone-text">Click to browse file</div>
                                {fileName && <div className="file-name" style={{ display: 'inline-flex' }}>{fileName}</div>}
                            </div>
                            <div className="action-bar">
                                <button className="btn btn-generate" onClick={handleGenerate}>🚀 Generate from File</button>
                            </div>
                        </div>
                    )}

                    {currentMode === 'random' && (
                        <div className="input-section active">
                            <div className="random-grid">
                                <div className="config-field"><label>How Many?</label><input type="number" value={randCount} onChange={e => setRandCount(e.target.value)} /></div>
                                <div className="config-field"><label>Code Length</label><input type="number" value={randLength} onChange={e => setRandLength(e.target.value)} /></div>
                                <div className="config-field"><label>Prefix</label><input type="text" value={randPrefix} onChange={e => setRandPrefix(e.target.value)} /></div>
                                <div className="config-field"><label>Suffix</label><input type="text" value={randSuffix} onChange={e => setRandSuffix(e.target.value)} /></div>
                            </div>
                            <div className="char-options">
                                <label className="char-option"><input type="checkbox" checked={randDigits} onChange={e => setRandDigits(e.target.checked)} /> 0-9</label>
                                <label className="char-option"><input type="checkbox" checked={randUpper} onChange={e => setRandUpper(e.target.checked)} /> A-Z</label>
                                <label className="char-option"><input type="checkbox" checked={randLower} onChange={e => setRandLower(e.target.checked)} /> a-z</label>
                                <label className="char-option"><input type="checkbox" checked={randSymbols} onChange={e => setRandSymbols(e.target.checked)} /> Symbols</label>
                            </div>
                            <div className="action-bar">
                                <button className="btn btn-generate" onClick={handleGenerate}>🎲 Generate Random</button>
                            </div>
                        </div>
                    )}

                </div>

                {allCodes.length > 0 ? (
                    <div className="results-section" id="resultsSection">
                        <div className="results-header">
                            <div className="results-title">
                                <h2>Generated Barcodes</h2>
                                <span className="results-count">{allCodes.length}</span>
                            </div>
                            <div className="results-actions">
                                <button className="btn btn-print btn-sm" onClick={printBarcodes}>🖨️ Print</button>
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div id="pageNav" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <button className="btn btn-outline btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                                <span style={{ fontSize: '0.85rem' }}>Page {currentPage} of {totalPages}</span>
                                <button className="btn btn-outline btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
                            </div>
                        )}

                        <div className={`barcode-grid cols-${config.colCount}`} style={{ gap: `${config.vGap}px ${config.hGap}px` }}>
                            {paginatedCodes.map((code, i) => (
                                <BarcodeItem key={(currentPage-1)*actualPerPage + i} code={code} index={(currentPage-1)*actualPerPage + i} config={config} />
                            ))}
                        </div>
                        
                        {/* Hidden Print Area */}
                        <div className="print-area">
                             {Array.from({ length: totalPages }).map((_, p) => (
                                 <div key={p} className={`barcode-grid cols-${config.colCount}`} style={{ gap: `${config.vGap}px ${config.hGap}px`, pageBreakAfter: 'always' }}>
                                     {allCodes.slice(p * actualPerPage, (p + 1) * actualPerPage).map((code, i) => (
                                         <BarcodeItem key={p * actualPerPage + i} code={code} index={p * actualPerPage + i} config={config} isPrint={true} />
                                     ))}
                                 </div>
                             ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No barcodes generated yet</h3>
                        <p>Choose your mode above and click Generate!</p>
                    </div>
                )}
            </div>

            <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>

            <footer className="site-footer">
                BarcodePro &bull; Professional Barcode & QR Code Generator
            </footer>
        </div>
    );
}
