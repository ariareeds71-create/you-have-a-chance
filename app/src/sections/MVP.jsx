import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { mvpIncluded, mvpExcluded } from '../data/content.js';
import './MVP.css';

export default function MVP() {
  return (
    <section className="section mvp" id="mvp">
      <div className="container">
        <SectionHeading lines={['First, we build the foundation.']} />

        <div className="mvp__grid">
          <div className="mvp__column">
            <h3 className="mvp__column-title">The first MVP includes</h3>
            <ul className="mvp__list">
              {mvpIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mvp__column mvp__column--not-yet">
            <h3 className="mvp__column-title">Not yet</h3>
            <ul className="mvp__list mvp__list--not-yet">
              {mvpExcluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
