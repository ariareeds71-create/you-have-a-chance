import React from 'react';
import './OpportunityCard.css';

export default function OpportunityCard({ opportunity }) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-card__top">
        <span className="opportunity-card__type">{opportunity.type}</span>
        <span className="opportunity-card__cost">{opportunity.cost}</span>
      </div>
      <p className="opportunity-card__description">{opportunity.description}</p>
      <dl className="opportunity-card__meta">
        <div>
          <dt>Region</dt>
          <dd>{opportunity.region}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{opportunity.stage}</dd>
        </div>
        <div>
          <dt>Sector</dt>
          <dd>{opportunity.sector}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{opportunity.deadline}</dd>
        </div>
      </dl>
      <a className="opportunity-card__cta" href="#opportunities">
        View details
      </a>
    </article>
  );
}
