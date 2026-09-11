import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import './Funding.css';

const readinessFields = [
  'Project readiness', 'Milestones', 'Funding target', 'Use of funds', 'Progress', 'Risks', 'Eligibility',
];

export default function Funding() {
  return (
    <section className="section funding" id="funding">
      <div className="container funding__grid">
        <div className="funding__copy">
          <SectionHeading
            lines={["Good ideas shouldn't die", "because they couldn't find a door."]}
            body="Funding is part of the long-term vision. But the platform will first help people prepare projects for funding before directly facilitating money."
          />
          <p className="funding__supporting">
            Funding requires trust, transparency, compliance, and the right infrastructure.
          </p>
          <Button href="#builders" variant="secondary">
            Prepare to build
          </Button>
        </div>

        <div className="funding__mock">
          <h3 className="funding__mock-title">Funding readiness (preview)</h3>
          <ul className="funding__mock-list">
            {readinessFields.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="funding__mock-note">
            No real funding activity is shown here. This is a preview of the structure a Builder will eventually fill
            in.
          </p>
        </div>
      </div>
    </section>
  );
}
