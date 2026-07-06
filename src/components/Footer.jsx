import React from 'react';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Column 1: Brand & Info */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="footer-icon">📄</span>
                        <span className="footer-title">BarcodePro</span>
                    </div>
                    <p className="footer-desc">
                        Free, private, and secure barcode tools that run entirely in your browser. No file uploads to servers — your data never leaves your device.
                    </p>
                    <div className="footer-security">
                        <span className="security-icon">🛡️</span>
                        <span>100% private & secure</span>
                    </div>
                    <div className="footer-email">
                        <span className="email-icon">✉️</span>
                        <span>support@barcodepro.in</span>
                    </div>
                </div>

                {/* Column 2: Popular Tools */}
                <div className="footer-column">
                    <h4 className="footer-heading">POPULAR TOOLS</h4>
                    <ul className="footer-links">
                        <li><a href="#/">Single Barcode</a></li>
                        <li><a href="#/">Bulk Generation</a></li>
                        <li><a href="#/">Sequential Barcodes</a></li>
                        <li><a href="#/">Import from Excel</a></li>
                        <li><a href="#/">QR Code Generator</a></li>
                        <li><a href="#/">Random Barcodes</a></li>
                    </ul>
                </div>

                {/* Column 3: Company */}
                <div className="footer-column">
                    <h4 className="footer-heading">COMPANY</h4>
                    <ul className="footer-links">
                        <li><a href="#/about">About Us</a></li>
                        <li><a href="#/contact">Contact</a></li>
                        <li><a href="#/blog">Blog</a></li>
                        <li><a href="#/privacy">Privacy Policy</a></li>
                        <li><a href="#/terms">Terms of Service</a></li>
                        <li><a href="#/disclaimer">Disclaimer</a></li>
                        <li><a href="#/dmca">DMCA</a></li>
                    </ul>
                </div>

                {/* Column 4: Resources */}
                <div className="footer-column">
                    <h4 className="footer-heading">RESOURCES</h4>
                    <ul className="footer-links">
                        <li><a href="#/blog/all-barcode-types">All Formats</a></li>
                        <li><a href="#/blog/qr-code-vs-barcode">QR vs Barcode</a></li>
                        <li><a href="#/blog/print-quality">Print Settings</a></li>
                        <li><a href="#/blog/scanner-guide">Scanner Guide</a></li>
                        <li><a href="#/blog/troubleshoot">Troubleshooting</a></li>
                        <li><a href="#/blog/api">Developer API</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} BarcodePro. All rights reserved.</p>
            </div>
        </footer>
    );
}
