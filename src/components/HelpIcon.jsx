import React from 'react';

export default function HelpIcon({ slug }) {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = `/blog/${slug}`;
    };

    return (
        <span className="help-icon" onClick={handleClick} title="Learn more about this setting">
            💡
        </span>
    );
}
