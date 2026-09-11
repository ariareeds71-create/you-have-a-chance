import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Button from '../components/Button.jsx';
import { demoProject } from '../data/content.js';
import './Builders.css';

export default function Builders() {
  return (
    <section className="section builders" id="builders">
      <div className="container builders__grid">
        <div className="builders__copy">
          <SectionHeading
            lines={['Start with what you have.']}
            body="You don't need to arrive with a registered company, a huge audience, or everything figured out. You can start with an idea."
          />
          <Button href="#top" variant="primary">
            Start building
          </Button>
          <p className="builders__note">Demo workspace shown for illustration — no account required to view this page.</p>
        </div>

        <div className="builders__mock">
          <ProjectCard project={demoProject} />
        </div>
      </div>
    </section>
  );
}
