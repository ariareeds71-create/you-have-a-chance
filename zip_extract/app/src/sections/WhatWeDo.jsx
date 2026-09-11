import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import RoleCard from '../components/RoleCard.jsx';
import { roles } from '../data/content.js';
import './WhatWeDo.css';

export default function WhatWeDo() {
  return (
    <section className="section" id="ecosystem">
      <div className="container">
        <SectionHeading lines={['One place to turn an idea into a possibility.']} />
        <div className="what-we-do__grid">
          {roles.map((role) => (
            <RoleCard role={role} key={role.key} />
          ))}
        </div>
      </div>
    </section>
  );
}
