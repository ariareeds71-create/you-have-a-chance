import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import './Collaborators.css';

const collaboratorTypes = [
  { role: 'Developer', looking: 'looking for a founder to build with' },
  { role: 'Designer', looking: 'looking for an early-stage project' },
  { role: 'Marketer', looking: 'looking for a startup to help grow' },
  { role: 'Researcher', looking: 'looking for collaborators on a study' },
  { role: 'Potential co-founder', looking: 'looking for a project to join' },
  { role: 'Specialist', looking: 'wanting to contribute a specific skill' },
];

export default function Collaborators() {
  return (
    <section className="section collaborators" id="collaborators">
      <div className="container">
        <SectionHeading
          lines={["You don't have to build alone."]}
          body="Find developers, designers, marketers, researchers, specialists, potential co-founders, and contributors who want to build something meaningful."
        />

        <ul className="collaborators__list">
          {collaboratorTypes.map((c) => (
            <li key={c.role} className="collaborators__item">
              <span className="collaborators__role">{c.role}</span>
              <span className="collaborators__looking">{c.looking}</span>
            </li>
          ))}
        </ul>

        <Button href="#collaborators" variant="secondary">
          Find collaborators
        </Button>
      </div>
    </section>
  );
}
