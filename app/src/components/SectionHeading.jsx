import React from 'react';
import './SectionHeading.css';

/**
 * lines: array of strings rendered as stacked heading lines (used when a
 * brief calls for a two-line headline like "MILLIONS HAVE THE AMBITION" /
 * "THEY DON'T HAVE THE ACCESS").
 * body: optional supporting paragraph.
 * align: 'left' | 'center'
 */
export default function SectionHeading({ lines, body, align = 'left', as = 'h2', id }) {
  const Tag = as;
  return (
    <div className={`section-heading section-heading--${align}`}>
      <Tag id={id} className="section-heading__title">
        {lines.map((line, i) => (
          <span className="section-heading__line" key={i}>
            {line}
          </span>
        ))}
      </Tag>
      {body && <p className="section-heading__body">{body}</p>}
    </div>
  );
}
