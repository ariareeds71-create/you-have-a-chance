import React from 'react';
import './MentorCard.css';

export default function MentorCard({ mentor }) {
  const initials = mentor.name
    .split(' ')
    .filter((w) => w[0] === w[0].toUpperCase() && w !== '—')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <article className="mentor-card">
      <div className="mentor-card__avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="mentor-card__body">
        <h3 className="mentor-card__name">{mentor.name}</h3>
        <p className="mentor-card__country">{mentor.country}</p>
        <ul className="mentor-card__skills">
          {mentor.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <p className="mentor-card__meta">Speaks {mentor.languages.join(', ')}</p>
        <p className="mentor-card__availability">{mentor.availability}</p>
      </div>
    </article>
  );
}
