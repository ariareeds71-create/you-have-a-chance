import React from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import RoadmapItem from '../components/RoadmapItem.jsx';
import { roadmap } from '../data/content.js';
import './Roadmap.css';

export default function Roadmap() {
  return (
    <section className="section roadmap" id="roadmap">
      <div className="container">
        <SectionHeading lines={['Build. Test. Listen. Improve.']} />
        <div className="roadmap__list">
          {roadmap.map((item) => (
            <RoadmapItem item={item} key={item.month} />
          ))}
        </div>
      </div>
    </section>
  );
}
