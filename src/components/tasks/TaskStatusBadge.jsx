import React from 'react';

const TaskStatusBadge = ({ status }) => {
  const statusConfig = {
    'TODO': { label: 'To Do', className: 'bg-gray-100 text-gray-700' },
    'IN_PROGRESS': { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
    'COMPLETED': { label: 'Completed', className: 'bg-green-100 text-green-700' },
    'BLOCKED': { label: 'Blocked', className: 'bg-red-100 text-red-700' },
    'REVIEW': { label: 'In Review', className: 'bg-purple-100 text-purple-700' }
  };

  const config = statusConfig[status] || statusConfig['TODO'];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default TaskStatusBadge;