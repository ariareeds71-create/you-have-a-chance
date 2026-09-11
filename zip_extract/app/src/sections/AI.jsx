import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import { aiModules } from '../data/content.js';
import './AI.css';

export default function AI() {
  return (
    <section className="section ai-section" id="ai">
      <div className="container">
        <SectionHeading
          lines={['Not just telling you what to do.', 'Showing you how.']}
          body="AI helps translate complicated instructions into understandable, actionable steps."
        />

        <div className="ai-section__flow" aria-hidden="true">
          <span className="ai-section__flow-item">"I don't know what to do."</span>
          <span className="ai-section__flow-arrow">→</span>
          <span className="ai-section__flow-item ai-section__flow-item--result">"Here's my next step."</span>
        </div>

        <div className="ai-section__grid">
          {aiModules.map((m) => (
            <FeatureCard title={m.title} description={m.description} key={m.key} />
          ))}
        </div>
      </div>
    </section>
  );
}
