import React from 'react';
import './JourneyStep.css';

export default function JourneyStep({ step, index, total }) {
  return (
    <div className="journey-step">
      <div className="journey-step__marker">
        <span className="journey-step__index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="journey-step__title">{step.title}</h3>
      <p className="journey-step__copy">{step.copy}</p>
      {index < total - 1 && <span className="journey-step__connector" aria-hidden="true" />}
    </div>
  );
}
