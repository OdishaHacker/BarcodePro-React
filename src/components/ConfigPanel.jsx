import React from 'react';
import HelpIcon from './HelpIcon';

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

export default function ConfigPanel({ config, updateConfig }) {
    const isQR = config.barcodeType === 'QR';
    const typeInfo = typeInfoMap[config.barcodeType];

    return (
        <>
            <div className="config-header">
                <div className="config-icon">⚙️</div>
                <div>
                    <div className="config-title">Configuration</div>
                    <div className="config-subtitle">Choose barcode type, layout, and display options</div>
                </div>
            </div>

            <div className="config-grid">
                <div className="config-field">
                    <label>Barcode Type <HelpIcon slug="barcode-type" /></label>
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
                    <label>Columns Per Row <HelpIcon slug="columns-per-row" /></label>
                    <select value={config.colCount} onChange={e => updateConfig('colCount', e.target.value)}>
                        <option value="1">1 Column</option>
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                        <option value="5">5 Columns</option>
                    </select>
                </div>
                <div className="config-field">
                    <label>Barcodes Per Page <HelpIcon slug="barcodes-per-page" /></label>
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
                            <label>Width <HelpIcon slug="barcode-width-height" /></label>
                            <input type="number" value={config.barWidth} step="0.5" onChange={e => updateConfig('barWidth', e.target.value)} />
                        </div>
                        <div className="config-field">
                            <label>Height <HelpIcon slug="barcode-width-height" /></label>
                            <input type="number" value={config.barHeight} onChange={e => updateConfig('barHeight', e.target.value)} />
                        </div>
                    </>
                )}
                {isQR && (
                    <div className="config-field">
                        <label>QR Module Size <HelpIcon slug="barcode-width-height" /></label>
                        <input type="number" value={config.qrSize} min="2" max="20" onChange={e => updateConfig('qrSize', e.target.value)} />
                    </div>
                )}
                <div className="config-field">
                    <label>Measurement Unit <HelpIcon slug="measurement-unit" /></label>
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
                        <label>Font Family <HelpIcon slug="font-settings" /></label>
                        <select value={config.fontFamily} onChange={e => updateConfig('fontFamily', e.target.value)}>
                            <option value="Inter">Inter (Default)</option>
                            <option value="Arial">Arial</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                    </div>
                    <div className="config-field">
                        <label>Font Size (px) <HelpIcon slug="font-settings" /></label>
                        <input type="number" value={config.fontSize} onChange={e => updateConfig('fontSize', e.target.value)} />
                    </div>
                    <div className="config-field">
                        <label>Text Gap ({config.textMargin}px) <HelpIcon slug="font-settings" /></label>
                        <input type="range" value={config.textMargin} min="0" max="50" onChange={e => updateConfig('textMargin', e.target.value)} />
                    </div>
                    <div className="config-field">
                        <label>Text Position <HelpIcon slug="font-settings" /></label>
                        <select value={config.textPosition} onChange={e => updateConfig('textPosition', e.target.value)}>
                            <option value="bottom">Bottom</option>
                            <option value="top">Top</option>
                        </select>
                    </div>
                </div>
                <div className="size-controls">
                    <div className="section-label"><span className="label-icon">↔️</span> Barcode Spacing</div>
                    <div className="config-field">
                        <label>Horizontal Gap (px) <HelpIcon slug="barcode-spacing" /></label>
                        <input type="number" value={config.hGap} onChange={e => updateConfig('hGap', e.target.value)} />
                    </div>
                    <div className="config-field">
                        <label>Vertical Gap (px) <HelpIcon slug="barcode-spacing" /></label>
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
        </>
    );
}
