import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import './Founder.css';

export default function Founder() {
  return (
    <section className="section founder" id="founder">
      <div className="container founder__grid">
        <div className="founder__photo-wrap">
          <img
            className="founder__photo"
            src="/founder.jpg"
            alt="Portrait of the founder"
            loading="lazy"
          />
        </div>

        <div className="founder__content">
          <SectionHeading
            lines={['I know what it feels like to have ambition without opportunity.']}
          />

          <div className="founder__text">
            <p>This platform began with a lived problem.</p>
            <p>
              The founder experienced job rejection, attempted to build businesses without enough knowledge or
              connections, struggled to access funding, and experienced the frustration of platforms that do not
              adequately include every country.
            </p>
            <p>The realization was simple: ambitious people don't necessarily lack ability. Sometimes the path is
              simply hidden.</p>
            <p className="founder__quotes">
              People are told: "Use AI." "Start a business." "Apply for funding." "Network." But they aren't always
              shown how to go from zero to the next step.
            </p>
            <p>So this platform is being built to make that path visible, practical, social, and repeatable.</p>
            <p className="founder__closing">
              I'm building the platform I wish existed when I had ambition but no money, connections, or clear path.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
