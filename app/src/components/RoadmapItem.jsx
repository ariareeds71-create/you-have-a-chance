import React from 'react';
import './RoadmapItem.css';

export default function RoadmapItem({ item }) {
  return (
    <div className="roadmap-item">
      <div className="roadmap-item__month">{item.month}</div>
      <h3 className="roadmap-item__title">{item.title}</h3>
      <ul className="roadmap-item__outputs">
        {item.outputs.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
    </div>
  );
}
