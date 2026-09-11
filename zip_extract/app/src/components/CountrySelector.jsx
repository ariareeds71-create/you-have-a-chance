import React, { useMemo, useState } from 'react';
import { countries } from '../data/countries.js';
import './CountrySelector.css';

export default function CountrySelector() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('Zimbabwe');

  const filtered = useMemo(() => {
    if (!query) return countries;
    return countries.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="country-selector">
      <label className="country-selector__label" htmlFor="country-search">
        Your country
      </label>
      <input
        id="country-search"
        className="country-selector__input"
        type="text"
        placeholder="Search every country…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="country-selector__list" role="listbox" aria-label="Country options">
        {filtered.slice(0, 8).map((c) => (
          <button
            key={c}
            role="option"
            aria-selected={selected === c}
            className={`country-selector__option ${selected === c ? 'is-selected' : ''}`}
            onClick={() => setSelected(c)}
            type="button"
          >
            {c}
          </button>
        ))}
        {filtered.length === 0 && <p className="country-selector__empty">No matches — every country is still supported.</p>}
      </div>
      <p className="country-selector__note">
        Selected: <strong>{selected}</strong>. Available services and requirements are shown per country, not the other
        way around.
      </p>
    </div>
  );
}
