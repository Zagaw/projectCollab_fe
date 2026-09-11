import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete, detailsTo }) => {
  const statusColors = {
    ACTIVE: 'bg-green-50 text-green-800',
    COMPLETED: 'bg-indigo-50 text-indigo-800',
    ON_HOLD: 'bg-amber-50 text-amber-800',
    CANCELLED: 'bg-red-50 text-red-700',
  };

  const statusLabel = {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    ON_HOLD: 'On hold',
    CANCELLED: 'Cancelled',
  };

  const href = detailsTo || `/lecturer/projects/${project.projectId}`;
  const showTeamCount = typeof project.teamCount === 'number';

  return (
    <article className="surface p-5 flex flex-col">
      {(project.status || project.createdAt) && (
        <div className="flex justify-between items-start gap-2 mb-3">
          {project.status ? (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-700'}`}>
              {statusLabel[project.status] || project.status}
            </span>
          ) : (
            <span />
          )}
          {project.createdAt && (
            <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-ink mb-2 line-clamp-1">{project.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
        {project.description || 'No description yet.'}
      </p>

      {(project.course || project.semester || showTeamCount) && (
        <div className="flex flex-wrap gap-1.5 text-sm text-gray-600 mb-3">
          {project.course && <span className="px-2 py-1 bg-gray-50 rounded-md">{project.course}</span>}
          {project.semester && <span className="px-2 py-1 bg-gray-50 rounded-md">{project.semester}</span>}
          {showTeamCount && (
            <span className="px-2 py-1 bg-gray-50 rounded-md">
              {project.teamCount} {project.teamCount === 1 ? 'team' : 'teams'}
            </span>
          )}
        </div>
      )}

      {(project.startDate || project.endDate) && (
        <p className="text-xs text-gray-500 mb-4">
          {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}
          {' – '}
          {project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}
        </p>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
        <Link to={href} className="btn-primary flex-1">
          View details
        </Link>
        {onDelete && (
          <button type="button" onClick={() => onDelete(project.projectId)} className="btn-danger">
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
