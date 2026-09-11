import React from 'react';
import Button from '../components/Button.jsx';
import './Hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Opportunity should not depend on the country you were born in.</p>
          <h1 className="hero__headline">You have a chance.</h1>
          <p className="hero__lede">Building a world where opportunity isn't limited by where you come from.</p>
          <p className="hero__body">
            Start with what you have. Learn what you don't know. Find people who can help. Build something. If it
            fails, learn. Get back up. Try again.
          </p>
          <div className="hero__actions">
            <Button href="#builders" variant="primary">
              Start building
            </Button>
            <Button href="#opportunities" variant="secondary">
              Explore opportunities
            </Button>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <svg viewBox="0 0 480 480" className="hero__globe" role="img" aria-label="Illustration of connected points across a globe, representing people in different regions">
            <circle cx="240" cy="240" r="180" fill="none" stroke="var(--color-border-strong)" strokeWidth="1" />
            <ellipse cx="240" cy="240" rx="180" ry="70" fill="none" stroke="var(--color-border-strong)" strokeWidth="1" />
            <ellipse cx="240" cy="240" rx="180" ry="130" fill="none" stroke="var(--color-border-strong)" strokeWidth="1" />
            <line x1="60" y1="240" x2="420" y2="240" stroke="var(--color-border-strong)" strokeWidth="1" />
            <line x1="240" y1="60" x2="240" y2="420" stroke="var(--color-border-strong)" strokeWidth="1" />
            {[
              [140, 150], [320, 130], [110, 300], [360, 300], [240, 90], [240, 390], [200, 240], [300, 210],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 7 : 5} fill="var(--color-accent)" opacity={0.85} />
            ))}
            <path d="M140,150 Q240,60 320,130" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.6" />
            <path d="M110,300 Q240,340 360,300" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.6" />
            <path d="M200,240 Q260,120 300,210" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
