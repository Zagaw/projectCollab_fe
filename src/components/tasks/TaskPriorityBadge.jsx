import React from 'react';

const TaskPriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'LOW': { label: 'Low', className: 'bg-gray-100 text-gray-700' },
    'MEDIUM': { label: 'Medium', className: 'bg-yellow-100 text-yellow-700' },
    'HIGH': { label: 'High', className: 'bg-orange-100 text-orange-700' },
    'URGENT': { label: 'Urgent', className: 'bg-red-100 text-red-700' }
  };

  const config = priorityConfig[priority] || priorityConfig['MEDIUM'];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default TaskPriorityBadge;