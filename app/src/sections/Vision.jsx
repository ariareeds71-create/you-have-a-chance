import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import './Vision.css';

const regions = [
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Middle East', 'Oceania',
];

export default function Vision() {
  return (
    <section className="section vision" id="vision">
      <div className="container">
        <SectionHeading
          align="center"
          lines={['Opportunity should not depend on the country you were born in.']}
          body="A world where a person's ambition can become an opportunity regardless of where they were born or how many resources they started with."
        />

        <div className="vision__regions" aria-hidden="true">
          {regions.map((r) => (
            <span className="vision__region" key={r}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
