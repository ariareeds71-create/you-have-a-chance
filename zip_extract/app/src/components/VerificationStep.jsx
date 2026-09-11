import React from 'react';
import './VerificationStep.css';

export default function VerificationStep({ item }) {
  return (
    <div className="verification-step">
      <div className="verification-step__stage">{item.stage}</div>
      <h3 className="verification-step__title">{item.title}</h3>
      <p className="verification-step__description">{item.description}</p>
      <ul className="verification-step__access">
        {item.access.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
