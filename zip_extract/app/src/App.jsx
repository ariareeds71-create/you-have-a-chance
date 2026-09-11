import React from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Hero from './sections/Hero.jsx';
import Problem from './sections/Problem.jsx';
import Founder from './sections/Founder.jsx';
import Door from './sections/Door.jsx';
import Vision from './sections/Vision.jsx';
import WhatWeDo from './sections/WhatWeDo.jsx';
import Journey from './sections/Journey.jsx';
import Builders from './sections/Builders.jsx';
import Mentors from './sections/Mentors.jsx';
import Collaborators from './sections/Collaborators.jsx';
import Opportunities from './sections/Opportunities.jsx';
import Funding from './sections/Funding.jsx';
import AI from './sections/AI.jsx';
import GlobalAccess from './sections/GlobalAccess.jsx';
import Trust from './sections/Trust.jsx';
import MVP from './sections/MVP.jsx';
import Roadmap from './sections/Roadmap.jsx';
import BusinessModel from './sections/BusinessModel.jsx';
import Principles from './sections/Principles.jsx';
import Closing from './sections/Closing.jsx';

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        <Founder />
        <Door />
        <Vision />
        <WhatWeDo />
        <Journey />
        <Builders />
        <Mentors />
        <Collaborators />
        <Opportunities />
        <Funding />
        <AI />
        <GlobalAccess />
        <Trust />
        <MVP />
        <Roadmap />
        <BusinessModel />
        <Principles />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
