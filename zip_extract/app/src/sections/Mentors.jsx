import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import MentorCard from '../components/MentorCard.jsx';
import Button from '../components/Button.jsx';
import { demoMentors } from '../data/content.js';
import './Mentors.css';

export default function Mentors() {
  return (
    <section className="section mentors" id="mentors">
      <div className="container">
        <SectionHeading
          lines={['Don\'t know how?', 'Ask someone who does.']}
          body="The platform makes asking for help normal. Mentors can be discovered by skill, industry, language, country, and availability."
        />

        <div className="mentors__grid">
          {demoMentors.map((mentor) => (
            <MentorCard mentor={mentor} key={mentor.id} />
          ))}
        </div>

        <div className="mentors__cta">
          <Button href="#mentors" variant="secondary">
            Find people who can help
          </Button>
        </div>
      </div>
    </section>
  );
}
