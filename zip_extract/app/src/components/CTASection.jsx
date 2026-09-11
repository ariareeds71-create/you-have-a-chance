import React from 'react';
import Button from './Button.jsx';
import './CTASection.css';

export default function CTASection({ title, body, primary, secondary, tone = 'light' }) {
  return (
    <div className={`cta-section cta-section--${tone}`}>
      <h3 className="cta-section__title">{title}</h3>
      {body && <p className="cta-section__body">{body}</p>}
      <div className="cta-section__actions">
        {primary && (
          <Button href={primary.href} variant={tone === 'dark' ? 'secondary' : 'primary'}>
            {primary.label}
          </Button>
        )}
        {secondary && (
          <Button href={secondary.href} variant="ghost">
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  );
}
