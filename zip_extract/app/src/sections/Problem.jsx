import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import './Problem.css';

export default function Problem() {
  return (
    <section className="section problem" id="problem">
      <div className="container">
        <SectionHeading
          lines={['Millions of people have the ambition.', "They just don't have the access."]}
        />

        <div className="problem__grid">
          <div className="problem__text">
            <p>
              Opportunity is unevenly distributed by geography, money, networks, experience, guidance, and access to
              trusted information.
            </p>
            <p>
              Many people have an idea but don't know what to do next. They are told to start a business, apply for
              funding, network, or use AI — but often nobody shows them exactly how to move from zero to the next
              step.
            </p>
          </div>

          <div className="problem__visual" aria-hidden="true">
            <div className="problem__bar-group">
              <span className="problem__bar-label">Ambition</span>
              <div className="problem__bar problem__bar--full" />
            </div>
            <div className="problem__bar-group">
              <span className="problem__bar-label">Access</span>
              <div className="problem__bar problem__bar--partial" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
