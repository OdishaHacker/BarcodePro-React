import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import qrcode from 'qrcode-generator';

const unitToPx = { px: 1, mm: 3.7795, cm: 37.795, inch: 96, pt: 1.333 };
const convertToPx = (value, unit) => Math.round(value * (unitToPx[unit] || 1));

export default function BarcodeItem({ code, index, config, isPrint = false }) {
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
}
