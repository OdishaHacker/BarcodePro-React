import React from 'react';
import BarcodeItem from './BarcodeItem';

export default function ResultsSection({ allCodes, config, currentPage, setCurrentPage }) {
    if (allCodes.length === 0) return null;

    const printBarcodes = () => {
        window.print();
    };

    const actualPerPage = config.perPageAll ? allCodes.length : (parseInt(config.perPage) || 15);
    const totalPages = Math.ceil(allCodes.length / actualPerPage) || 1;
    const paginatedCodes = allCodes.slice((currentPage - 1) * actualPerPage, currentPage * actualPerPage);

    return (
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
    );
}
