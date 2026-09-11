import React, { useEffect, useState } from 'react';
import Button from './Button.jsx';
import MobileMenu from './MobileMenu.jsx';
import { nav } from '../data/content.js';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand">
          <span className="navbar__brand-mark" aria-hidden="true" />
          {nav.brand}
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <Button href={nav.secondaryCta.href} variant="ghost">
            {nav.secondaryCta.label}
          </Button>
          <Button href={nav.primaryCta.href} variant="primary">
            {nav.primaryCta.label}
          </Button>
        </div>

        <button
          className="navbar__toggle"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className={`navbar__toggle-bar ${isOpen ? 'is-open' : ''}`} />
          <span className={`navbar__toggle-bar ${isOpen ? 'is-open' : ''}`} />
        </button>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
