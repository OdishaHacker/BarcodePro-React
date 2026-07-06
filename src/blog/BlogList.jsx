import React, { useState, useEffect } from 'react';
import blogArticles from './blogData';

const categories = ['All', ...new Set(blogArticles.map(a => a.category))];

export default function BlogList({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredArticles = blogArticles.filter(article => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        const matchesSearch = searchQuery === '' || 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="blog-list-page">
            {/* Blog Hero */}
            <div className="blog-hero">
                <h1>📚 BarcodePro Blog</h1>
                <p>Learn everything about barcodes, QR codes, and how to use our tool effectively. Expert guides, tips, and best practices.</p>
                
                {/* Search Bar */}
                <div className="blog-search">
                    <input 
                        type="text" 
                        placeholder="🔍 Search articles..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="blog-categories">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        className={`blog-category-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat === 'All' && '📋 '}
                        {cat === 'Barcode Types' && '📊 '}
                        {cat === 'Settings' && '⚙️ '}
                        {cat === 'Modes' && '🎯 '}
                        {cat}
                        <span className="blog-count">
                            {cat === 'All' ? blogArticles.length : blogArticles.filter(a => a.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="blog-grid">
                {filteredArticles.map(article => (
                    <div key={article.slug} className="blog-card" onClick={() => onNavigate(`blog/${article.slug}`)}>
                        <div className="blog-card-header">
                            <span className="blog-category-badge">{article.category}</span>
                            <span className="blog-card-date">{article.readTime}</span>
                        </div>
                        <h3 className="blog-card-title">{article.title}</h3>
                        <p className="blog-card-desc">{article.description}</p>
                        <div className="blog-card-footer">
                            <span className="blog-card-date">📅 {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="blog-read-more">Read more →</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="blog-no-results">
                    <div className="blog-no-results-icon">🔍</div>
                    <h3>No articles found</h3>
                    <p>Try a different search term or category.</p>
                </div>
            )}

            {/* Back to Tool */}
            <div className="blog-back-tool">
                <button className="btn btn-primary" onClick={() => onNavigate('home')}>🚀 Back to Barcode Generator</button>
            </div>
        </div>
    );
}
