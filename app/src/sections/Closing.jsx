import React from 'react';
import Button from '../components/Button.jsx';
import './Closing.css';

export default function Closing() {
  return (
    <section className="closing" id="closing">
      <div className="container closing__inner">
        <p className="closing__prelude">If the door doesn't exist,</p>
        <h2 className="closing__headline">Create one.</h2>
        <p className="closing__statement">You have a chance.</p>

        <div className="closing__list">
          <p>Start with what you have.</p>
          <p>Learn what you don't know.</p>
          <p>Find people who can help.</p>
          <p>Build something.</p>
          <p>If it fails, learn.</p>
          <p>Get back up.</p>
          <p>Try again.</p>
        </div>

        <p className="closing__final">And this project is about making sure more people have one too.</p>

        <div className="closing__actions">
          <Button href="#builders" variant="primary">
            Start building
          </Button>
          <Button href="#opportunities" variant="secondary">
            Explore opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
