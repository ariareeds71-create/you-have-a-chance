import React from 'react';
import Button from './Button.jsx';
import { nav } from '../data/content.js';
import './MobileMenu.css';

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!isOpen}>
      <nav className="mobile-menu__links" aria-label="Mobile">
        {nav.links.map((link) => (
          <a key={link.href} href={link.href} className="mobile-menu__link" onClick={onClose}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="mobile-menu__actions">
        <Button href={nav.secondaryCta.href} variant="secondary" onClick={onClose}>
          {nav.secondaryCta.label}
        </Button>
        <Button href={nav.primaryCta.href} variant="primary" onClick={onClose}>
          {nav.primaryCta.label}
        </Button>
      </div>
    </div>
  );
}
