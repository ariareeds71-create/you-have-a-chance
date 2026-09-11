import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import CountrySelector from '../components/CountrySelector.jsx';
import './GlobalAccess.css';

export default function GlobalAccess() {
  return (
    <section className="section global-access" id="global-access">
      <div className="container global-access__grid">
        <div>
          <SectionHeading
            lines={['Built for the world.']}
            body="Every country belongs in the architecture. Individual services may have country-specific requirements because of laws, providers, payments, or eligibility."
          />
          <p className="global-access__note">
            A service limitation should never become a statement that the person does not belong.
          </p>
        </div>

        <CountrySelector />
      </div>
    </section>
  );
}
