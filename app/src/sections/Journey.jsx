import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import JourneyStep from '../components/JourneyStep.jsx';
import { journeySteps } from '../data/content.js';
import './Journey.css';

export default function Journey() {
  return (
    <section className="section journey" id="journey">
      <div className="container">
        <SectionHeading lines={['From idea to possibility.']} />
        <div className="journey__grid">
          {journeySteps.map((step, i) => (
            <JourneyStep step={step} index={i} total={journeySteps.length} key={step.key} />
          ))}
        </div>
      </div>
    </section>
  );
}
