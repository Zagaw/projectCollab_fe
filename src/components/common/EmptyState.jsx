import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, description, actionText, actionLink }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;