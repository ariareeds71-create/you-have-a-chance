import React from 'react';
import './Door.css';

export default function Door() {
  return (
    <section className="section-tight door">
      <div className="container door__inner">
        <svg className="door__mark" viewBox="0 0 120 160" role="img" aria-label="An open doorway with light beyond it">
          <rect x="10" y="10" width="100" height="140" rx="2" fill="none" stroke="var(--color-border-strong)" strokeWidth="2" />
          <path d="M10 150 L60 150 L110 150" stroke="var(--color-border-strong)" strokeWidth="2" fill="none" />
          <path d="M55 10 L55 150" stroke="var(--color-border-strong)" strokeWidth="1.5" opacity="0.5" />
          <rect x="58" y="16" width="46" height="128" fill="var(--color-accent-tint)" />
          <circle cx="66" cy="82" r="2.4" fill="var(--color-accent)" />
        </svg>

        <p className="door__statement">Sometimes the door simply doesn't exist.</p>
        <h2 className="door__cta">So create one.</h2>
        <p className="door__body">
          The goal is not to tell people to wait until they have everything. The goal is to help create another path
          forward.
        </p>
      </div>
    </section>
  );
}
