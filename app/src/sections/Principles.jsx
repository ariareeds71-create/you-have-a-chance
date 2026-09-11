import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { principles } from '../data/content.js';
import './Principles.css';

export default function Principles() {
  return (
    <section className="section principles" id="principles">
      <div className="container">
        <SectionHeading lines={['What we believe.']} />
        <ol className="principles__list">
          {principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
