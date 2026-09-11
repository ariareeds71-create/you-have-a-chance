import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import OpportunityCard from '../components/OpportunityCard.jsx';
import { demoOpportunities, opportunityFilters } from '../data/content.js';
import './Opportunities.css';

const filterGroups = [
  { key: 'location', label: 'Location' },
  { key: 'stage', label: 'Stage' },
  { key: 'type', label: 'Type' },
  { key: 'sector', label: 'Sector' },
  { key: 'cost', label: 'Cost' },
];

export default function Opportunities() {
  const [activeType, setActiveType] = useState('All');

  const visible =
    activeType === 'All' ? demoOpportunities : demoOpportunities.filter((o) => o.type === activeType);

  return (
    <section className="section opportunities" id="opportunities">
      <div className="container">
        <SectionHeading
          lines={['Stop searching everywhere.']}
          body="Instead of sending people across the internet to search for grants, accelerators, competitions, training, mentorship, and funding, the platform is designed to bring relevant opportunities into one discovery layer."
        />

        <div className="opportunities__filters" role="group" aria-label="Filter opportunities by type">
          <button
            className={`opportunities__filter ${activeType === 'All' ? 'is-active' : ''}`}
            onClick={() => setActiveType('All')}
            type="button"
            aria-pressed={activeType === 'All'}
          >
            All
          </button>
          {opportunityFilters.type.map((t) => (
            <button
              key={t}
              className={`opportunities__filter ${activeType === t ? 'is-active' : ''}`}
              onClick={() => setActiveType(t)}
              type="button"
              aria-pressed={activeType === t}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="opportunities__grid">
          {visible.map((o) => (
            <OpportunityCard opportunity={o} key={o.id} />
          ))}
        </div>

        <div className="opportunities__more-filters">
          <p className="opportunities__more-filters-label">Filters coming to the full product:</p>
          <div className="opportunities__more-filters-list">
            {filterGroups.map((g) => (
              <span key={g.key} className="opportunities__more-filter-chip">
                {g.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
