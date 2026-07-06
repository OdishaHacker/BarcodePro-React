import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import qrcode from 'qrcode-generator';
import html2canvas from 'html2canvas';

const unitToPx = { px: 1, mm: 3.7795, cm: 37.795, inch: 96, pt: 1.333 };
const convertToPx = (value, unit) => Math.round(value * (unitToPx[unit] || 1));

const BarcodeItem = React.memo(function BarcodeItem({ code, index, config, isPrint = false }) {
    const svgRef = useRef(null);
    const cardRef = useRef(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!cardRef.current) return;
        
        // temporarily force the card to look like a print version
        const originalBg = cardRef.current.style.background;
        const originalBorder = cardRef.current.style.border;
        cardRef.current.style.background = '#ffffff';
        cardRef.current.style.border = 'none';

        try {
            const canvas = await html2canvas(cardRef.current, { 
                backgroundColor: '#ffffff', 
                scale: 3,
                logging: false,
                onclone: (documentClone) => {
                    // Force SVG lines to be black in the clone
                    const clonedCard = documentClone.getElementById(cardRef.current.id);
                    if (clonedCard) {
                        const svg = clonedCard.querySelector('svg');
                        if (svg) {
                            svg.querySelectorAll('rect, path').forEach(el => {
                                if (el.getAttribute('fill') === '#e8e8f0') {
                                    el.setAttribute('fill', '#000000');
                                }
                            });
                        }
                        const qr = clonedCard.querySelector('.qr-wrapper');
                        if (qr) {
                            qr.style.filter = 'none';
                        }
                    }
                }
            });
            
            cardRef.current.style.background = originalBg;
            cardRef.current.style.border = originalBorder;
            
            canvas.toBlob(blob => {
                if (blob) {
                    navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    });
                }
            }, 'image/png');
        } catch (e) {
            cardRef.current.style.background = originalBg;
            cardRef.current.style.border = originalBorder;
            console.error('Copy failed', e);
            // fallback to text copy
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
            <div id={isPrint ? `print-barcode-${index}` : `barcode-${index}`} ref={cardRef} className={`barcode-card ${isPrint ? (config.showBorder ? 'with-border' : 'no-border') : ''}`} style={{ position: 'relative' }}>
                {!isPrint && <span className="card-index" data-html2canvas-ignore="true">#{index + 1}</span>}
                {!isPrint && (
                    <button className="copy-btn" onClick={handleCopy} title="Copy Image" data-html2canvas-ignore="true">
                        {copied ? '✅' : '📋'}
                    </button>
                )}
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
        <div id={isPrint ? `print-barcode-${index}` : `barcode-${index}`} ref={cardRef} className={`barcode-card ${isPrint ? (config.showBorder ? 'with-border' : 'no-border') : ''}`} style={{ position: 'relative' }}>
            {!isPrint && <span className="card-index" data-html2canvas-ignore="true">#{index + 1}</span>}
            {!isPrint && (
                <button className="copy-btn" onClick={handleCopy} title="Copy Image" data-html2canvas-ignore="true">
                    {copied ? '✅' : '📋'}
                </button>
            )}
            {error ? (
                <p style={{ color: '#ff5050', fontSize: '0.8rem', padding: '12px' }}>❌ {error}</p>
            ) : (
                <svg ref={svgRef}></svg>
            )}
        </div>
    );
});

export default BarcodeItem;
