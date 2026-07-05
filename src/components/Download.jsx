import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Download({ onClose, showToast }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (format) => {
        setIsDownloading(true);
        const printArea = document.querySelector('.print-area');
        
        if (!printArea) {
            showToast('⚠️ Nothing to download');
            setIsDownloading(false);
            return;
        }

        try {
            if (format === 'png' || format === 'jpeg') {
                // Temporarily make it block for rendering if it was hidden
                const oldDisplay = printArea.style.display;
                printArea.style.display = 'block';
                
                const canvas = await html2canvas(printArea, { scale: 2, backgroundColor: '#ffffff' });
                
                printArea.style.display = oldDisplay;
                
                const link = document.createElement('a');
                link.download = `barcodes.${format}`;
                link.href = canvas.toDataURL(`image/${format}`);
                link.click();
            } 
            else if (format === 'pdf') {
                const oldDisplay = printArea.style.display;
                printArea.style.display = 'block';
                
                // Need to take screenshot of each page individually if they are separate divs
                const pages = printArea.querySelectorAll('.barcode-grid');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                for (let i = 0; i < pages.length; i++) {
                    const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff' });
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    
                    // A4 dimensions: 210 x 297 mm
                    const pdfWidth = 210;
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }
                
                printArea.style.display = oldDisplay;
                pdf.save('barcodes.pdf');
            }
            else if (format === 'word' || format === 'excel') {
                // Word and Excel trick: Create an HTML document with Office namespaces
                const header = format === 'word' 
                    ? `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Barcodes</title></head><body>`
                    : `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Barcodes</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;
                
                const footer = "</body></html>";
                
                // Get all SVG/Images and convert them to Base64 so they embed correctly in the file
                const oldDisplay = printArea.style.display;
                printArea.style.display = 'block';
                
                const canvas = await html2canvas(printArea, { scale: 1.5, backgroundColor: '#ffffff' });
                const base64Img = canvas.toDataURL('image/png');
                
                printArea.style.display = oldDisplay;
                
                // Embed the large screenshot in the Word/Excel file
                const html = `${header}<h2>Generated Barcodes</h2><img src="${base64Img}" alt="barcodes" />${footer}`;
                
                const blob = new Blob(['\ufeff', html], {
                    type: format === 'word' ? 'application/msword' : 'application/vnd.ms-excel'
                });
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = format === 'word' ? 'barcodes.doc' : 'barcodes.xls';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            showToast(`✅ Downloaded as ${format.toUpperCase()}`);
        } catch (e) {
            console.error('Download error:', e);
            showToast('⚠️ Error generating file');
        } finally {
            setIsDownloading(false);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', minWidth: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-primary)' }}>Download Barcodes</h3>
                {isDownloading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⏳</div>
                        <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Generating file... Please wait</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="btn btn-outline" onClick={() => handleDownload('pdf')}>📄 Download as PDF (A4)</button>
                        <button className="btn btn-outline" onClick={() => handleDownload('word')}>📝 Download as Word (.doc)</button>
                        <button className="btn btn-outline" onClick={() => handleDownload('excel')}>📊 Download as Excel (.xls)</button>
                        <button className="btn btn-outline" onClick={() => handleDownload('png')}>🖼️ Download as PNG Image</button>
                        <button className="btn btn-outline" onClick={() => handleDownload('jpeg')}>📸 Download as JPEG Image</button>
                    </div>
                )}
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '6px 12px' }} onClick={onClose} disabled={isDownloading}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
