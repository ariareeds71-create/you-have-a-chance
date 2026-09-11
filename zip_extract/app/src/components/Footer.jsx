import React from 'react';
import { footerLinks, nav } from '../data/content.js';
import './Footer.css';

const socials = ['LinkedIn', 'Instagram', 'X'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand-block">
            <a href="#top" className="footer__brand">
              <span className="footer__brand-mark" aria-hidden="true" />
              {nav.brand}
            </a>
            <p className="footer__statement">
              A global ecosystem for people with ideas, people who can help, and people who can fund meaningful
              projects.
            </p>
          </div>

          <nav className="footer__links" aria-label="Footer">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 PROJECT NAME. All rights reserved.</p>
          <div className="footer__socials" aria-label="Social links (not yet active)">
            {socials.map((s) => (
              <span key={s} className="footer__social" title="Coming soon">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
