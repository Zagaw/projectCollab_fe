import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { IconWell } from './PageHeader';

const isGlyph = (value) =>
  typeof value === 'function' || (value && typeof value === 'object' && !React.isValidElement(value));

const EmptyState = ({ title, description, actionText, actionLink, onAction, icon }) => {
  const element = React.isValidElement(icon) ? icon : null;
  const Glyph = !element && isGlyph(icon) && typeof icon !== 'string' ? icon : Inbox;

  return (
    <div className="text-center py-14 surface px-6">
      <div className="mx-auto mb-4 flex justify-center">
        <IconWell tone="teal" size="lg">
          {element || <Glyph className="w-6 h-6" strokeWidth={1.75} aria-hidden />}
        </IconWell>
      </div>
      <h3 className="text-lg font-medium text-ink mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary mt-5">
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-5">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
