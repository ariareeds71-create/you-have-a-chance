import React from 'react';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-card__header">
        <span className="project-card__stage">{project.stage}</span>
        <h3 className="project-card__name">{project.name}</h3>
      </div>

      <div className="project-card__grid">
        <div>
          <h4>Problem</h4>
          <p>{project.problem}</p>
        </div>
        <div>
          <h4>Solution</h4>
          <p>{project.solution}</p>
        </div>
        <div>
          <h4>Target users</h4>
          <p>{project.targetUsers}</p>
        </div>
      </div>

      <div className="project-card__section">
        <h4>Milestones</h4>
        <ul className="project-card__checklist">
          {project.milestones.map((m) => (
            <li key={m.label} className={m.done ? 'is-done' : ''}>
              <span className="project-card__checkbox" aria-hidden="true">
                {m.done ? '✓' : ''}
              </span>
              {m.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="project-card__section">
        <h4>Tasks</h4>
        <ul className="project-card__checklist">
          {project.tasks.map((t) => (
            <li key={t.label} className={t.done ? 'is-done' : ''}>
              <span className="project-card__checkbox" aria-hidden="true">
                {t.done ? '✓' : ''}
              </span>
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="project-card__next">
        <h4>Next step</h4>
        <p>{project.nextStep}</p>
      </div>

      <div className="project-card__footer">
        <span>{project.opportunities} matching opportunities</span>
      </div>
    </div>
  );
}
