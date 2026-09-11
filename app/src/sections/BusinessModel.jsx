import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { businessModel } from '../data/content.js';
import './BusinessModel.css';

export default function BusinessModel() {
  return (
    <section className="section business-model" id="business-model">
      <div className="container">
        <SectionHeading lines={['The mission comes first.']} />
        <p className="business-model__intro">
          The platform should remain useful to people who start with limited resources. These are long-term business
          model possibilities, not existing revenue.
        </p>
        <ul className="business-model__list">
          {businessModel.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="business-model__closing">Revenue should support the mission rather than distort it.</p>
      </div>
    </section>
  );
}
