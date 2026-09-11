import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import VerificationStep from '../components/VerificationStep.jsx';
import { verificationStages } from '../data/content.js';
import './Trust.css';

export default function Trust() {
  return (
    <section className="section trust" id="trust">
      <div className="container">
        <SectionHeading lines={['Open to everyone.', 'Safe for everyone.']} />

        <p className="trust__intro">
          Global access requires serious trust and safety. Verification does not equal endorsement or a guaranteed
          outcome — it establishes that a real person, project, or business is behind an account.
        </p>

        <div className="trust__stages">
          {verificationStages.map((stage) => (
            <VerificationStep item={stage} key={stage.key} />
          ))}
        </div>

        <p className="trust__principle">Collect the minimum. Protect the maximum.</p>
      </div>
    </section>
  );
}
