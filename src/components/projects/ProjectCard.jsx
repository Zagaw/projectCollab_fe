import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    ON_HOLD: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700'
  };

  const statusLabel = {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
            {statusLabel[project.status]}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description || 'No description provided'}
        </p>

        {/* Course & Semester */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded-lg">{project.course}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-lg">{project.semester}</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div>
            <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">End:</span> {new Date(project.endDate).toLocaleDateString()}
          </div>
        </div>

        {/* Teams Count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>👥</span>
          <span>{project.teamCount || 0} Teams</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <Link
            to={`/lecturer/projects/${project.projectId}`}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => onDelete(project.projectId)}
            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;