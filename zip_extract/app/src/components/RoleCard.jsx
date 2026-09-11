import React from 'react';
import './RoleCard.css';

export default function RoleCard({ role }) {
  return (
    <article className="role-card">
      <h3 className="role-card__title">{role.title}</h3>
      <p className="role-card__need">{role.need}</p>
      <p className="role-card__description">{role.description}</p>
    </article>
  );
}
