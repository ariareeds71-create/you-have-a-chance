import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
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
          <p className="builders__note">Your projects appear inside the protected workspace after you sign in.</p>
        </div>

        <div className="builders__mock"><p className="builders__note">No public projects are available yet.</p></div>
      </div>
    </section>
  );
}
