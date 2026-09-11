import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, description, actionText, actionLink, onAction, icon }) => {
  const customIcon = icon && typeof icon !== 'string' ? icon : null;

  return (
    <div className="text-center py-14 surface px-6">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
        {customIcon || (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-8 5-8-5" />
          </svg>
        )}
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
