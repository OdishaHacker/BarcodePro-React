import React, { useState } from 'react';
import './index.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ConfigPanel from './components/ConfigPanel';
import ResultsSection from './components/ResultsSection';

// Modes
import SingleBarcode from './components/modes/SingleBarcode';
import BulkBarcode from './components/modes/BulkBarcode';
import SequentialBarcode from './components/modes/SequentialBarcode';
import ImportBarcode from './components/modes/ImportBarcode';
import RandomBarcode from './components/modes/RandomBarcode';

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

    const [currentMode, setCurrentMode] = useState('single');
    const [allCodes, setAllCodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleGenerate = (codes) => {
        if (!codes || codes.length === 0) return;
        
        setAllCodes(codes);
        setCurrentPage(1);
        showToast(`✅ ${codes.length} barcode${codes.length > 1 ? 's' : ''} generated!`);
        
        setTimeout(() => {
             document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const resetAll = () => {
        setAllCodes([]);
        setConfig({
            barcodeType: 'CODE128', colCount: '3', perPage: 15, perPageAll: false,
            barWidth: 2, barHeight: 55, qrSize: 6, globalUnit: 'px', fontFamily: 'Inter',
            fontSize: 14, textMargin: 6, textPosition: 'bottom', hGap: 16, vGap: 16,
            showText: true, boldText: false, showBorder: true,
        });
        setCurrentMode('single');
        showToast('🔄 Reset complete');
    };

    return (
        <div className="app-wrapper">
            <Header resetAll={resetAll} />

            <div className="main-container">
                <div className="config-panel">
                    
                    <ConfigPanel config={config} updateConfig={updateConfig} />

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

                    {currentMode === 'single' && <SingleBarcode onGenerate={handleGenerate} showToast={showToast} />}
                    {currentMode === 'bulk' && <BulkBarcode onGenerate={handleGenerate} showToast={showToast} />}
                    {currentMode === 'sequential' && <SequentialBarcode onGenerate={handleGenerate} showToast={showToast} />}
                    {currentMode === 'import' && <ImportBarcode onGenerate={handleGenerate} showToast={showToast} />}
                    {currentMode === 'random' && <RandomBarcode onGenerate={handleGenerate} showToast={showToast} />}

                </div>

                {allCodes.length > 0 ? (
                    <ResultsSection 
                        allCodes={allCodes} 
                        config={config} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage}
                        showToast={showToast}
                    />
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No barcodes generated yet</h3>
                        <p>Choose your mode above and click Generate!</p>
                    </div>
                )}
            </div>

            <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>

            <Footer />
        </div>
    );
}
