import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = ({ to, size = 'md', showWordmark = true, onPaper = false }) => {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const word = size === 'lg' ? 'text-2xl' : 'text-lg';

  const mark = (
    <span className="flex items-center gap-2.5 min-w-0">
      <img
        src="/collabora-logo.png"
        alt=""
        className={`${box} rounded-lg bg-white object-cover object-[center_22%] shrink-0`}
      />
      {showWordmark && (
        <span className={`font-semibold tracking-tight ${word} ${onPaper ? 'text-ink' : 'text-white'}`}>
          Collabora
        </span>
      )}
    </span>
  );

  if (!to) return mark;
  return (
    <Link to={to} className="flex items-center min-w-0" aria-label="Collabora home">
      {mark}
    </Link>
  );
};

export default BrandLogo;
