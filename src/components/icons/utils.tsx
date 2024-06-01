import React from 'react';

export function createSvgIcon(content: React.JSX.Element, viewBox = '0 0 24 24') {
    return (
        <svg className="nl-svg-icon" focusable="false" viewBox={viewBox} aria-hidden="true">
            {content}
        </svg>
    );
}
