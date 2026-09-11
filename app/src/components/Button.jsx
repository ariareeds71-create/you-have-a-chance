import React from 'react';
import './Button.css';

/**
 * Button renders either an <a> (when href is provided) or a <button>.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({ href, onClick, variant = 'primary', children, type = 'button', ...rest }) {
  const className = `btn btn--${variant}`;

  if (href) {
    return (
      <a className={className} href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type} {...rest}>
      {children}
    </button>
  );
}
