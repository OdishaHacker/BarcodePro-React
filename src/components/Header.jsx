import React from 'react';

export default function Header({ resetAll, navigate }) {
    return (
        <>
            <nav className="navbar">
                <a className="navbar-brand" href="#/" onClick={(e) => { e.preventDefault(); navigate && navigate('home'); }}>
                    <div className="navbar-logo">B</div>
                    <div className="navbar-title">Barcode<span>Pro</span></div>
                </a>
                <div className="navbar-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate && navigate('blog')}>📚 Blog</button>
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
