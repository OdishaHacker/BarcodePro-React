import React from 'react';

export default function Header({ resetAll }) {
    return (
        <>
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
        </>
    );
}
