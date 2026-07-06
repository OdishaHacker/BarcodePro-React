import React, { useEffect } from 'react';
import blogArticles from './blogData';

export default function BlogPage({ slug, onNavigate }) {
    const article = blogArticles.find(a => a.slug === slug);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) {
        return (
            <div className="blog-not-found">
                <div className="blog-not-found-icon">📄</div>
                <h2>Article Not Found</h2>
                <p>Sorry, we could not find the article you are looking for.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('blog')}>← Back to Blog</button>
            </div>
        );
    }

    // Find related articles (same category, excluding current)
    const related = blogArticles
        .filter(a => a.category === article.category && a.slug !== slug)
        .slice(0, 3);

    // Find prev and next articles
    const currentIndex = blogArticles.findIndex(a => a.slug === slug);
    const prevArticle = currentIndex > 0 ? blogArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < blogArticles.length - 1 ? blogArticles[currentIndex + 1] : null;

    return (
        <div className="blog-page">
            {/* Breadcrumb */}
            <nav className="blog-breadcrumb">
                <span className="breadcrumb-link" onClick={() => onNavigate('home')}>🏠 Home</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-link" onClick={() => onNavigate('blog')}>📚 Blog</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{article.title}</span>
            </nav>

            {/* Article Header */}
            <header className="blog-article-header">
                <span className="blog-category-badge">{article.category}</span>
                <h1>{article.title}</h1>
                <div className="blog-meta">
                    <span className="blog-meta-item">📅 {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="blog-meta-item">⏱️ {article.readTime}</span>
                </div>
            </header>

            {/* Article Image */}
            {article.image && (
                <div className="blog-article-image" style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            )}

            {/* Article Content */}
            <article className="blog-article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Back to Tool CTA */}
            <div className="blog-cta">
                <h3>Ready to Generate Barcodes?</h3>
                <p>Use our free online tool to create professional barcodes instantly.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('home')}>🚀 Open Barcode Generator</button>
            </div>

            {/* Article Navigation */}
            <div className="blog-nav-links">
                {prevArticle && (
                    <div className="blog-nav-prev" onClick={() => onNavigate(`blog/${prevArticle.slug}`)}>
                        <span className="blog-nav-label">← Previous</span>
                        <span className="blog-nav-title">{prevArticle.title}</span>
                    </div>
                )}
                {nextArticle && (
                    <div className="blog-nav-next" onClick={() => onNavigate(`blog/${nextArticle.slug}`)}>
                        <span className="blog-nav-label">Next →</span>
                        <span className="blog-nav-title">{nextArticle.title}</span>
                    </div>
                )}
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
                <div className="blog-related">
                    <h3>Related Articles</h3>
                    <div className="blog-related-grid">
                        {related.map(r => (
                            <div key={r.slug} className="blog-related-card" onClick={() => onNavigate(`blog/${r.slug}`)}>
                                <span className="blog-category-badge small">{r.category}</span>
                                <h4>{r.title}</h4>
                                <p>{r.description.substring(0, 100)}...</p>
                                <span className="blog-read-more">Read more →</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
