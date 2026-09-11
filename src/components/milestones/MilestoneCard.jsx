import React from 'react';
import { Link } from 'react-router-dom';

const isOverdueMilestone = (milestone) =>
  milestone.deadline && new Date(milestone.deadline) < new Date() && !milestone.isCompleted;

const MilestoneCard = ({ milestone, onComplete, onDelete, onViewDetails, detailsTo, showActions = true }) => {
  const overdue = isOverdueMilestone(milestone);

  const statusLabel = milestone.isCompleted ? 'Completed' : overdue ? 'Overdue' : 'In progress';
  const statusClass = milestone.isCompleted
    ? 'bg-green-50 text-green-800'
    : overdue
      ? 'bg-red-50 text-red-700'
      : 'bg-amber-50 text-amber-800';

  return (
    <article className={`surface p-4 ${overdue ? 'border-red-200' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        {detailsTo ? (
          <Link to={detailsTo} className="text-left font-semibold text-ink hover:text-indigo-700 min-w-0 flex-1">
            {milestone.title}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(milestone.milestoneId)}
            className="text-left font-semibold text-ink hover:text-indigo-700 min-w-0 flex-1"
          >
            {milestone.title}
          </button>
        )}
        <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      {(milestone.projectTitle || milestone.teamName) && (
        <p className="text-sm text-gray-500 mt-1">
          {milestone.projectTitle}
          {milestone.projectTitle && milestone.teamName ? ' · ' : ''}
          {milestone.teamName}
        </p>
      )}

      {milestone.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{milestone.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {milestone.deadline && (
          <span className={`text-xs px-2 py-1 rounded-md ${overdue ? 'bg-red-50 text-red-700 font-medium' : 'bg-gray-50 text-gray-600'}`}>
            {new Date(milestone.deadline).toLocaleDateString()}
            {overdue ? ' · overdue' : ''}
          </span>
        )}
        {milestone.completedAt && (
          <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-600">
            Done {new Date(milestone.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {detailsTo ? (
          <Link to={detailsTo} className="btn-primary !py-1.5 !px-3 text-xs flex-1 text-center">
            View details
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(milestone.milestoneId)}
            className="btn-primary !py-1.5 !px-3 text-xs flex-1"
          >
            View details
          </button>
        )}
        {showActions && (
          <>
            {!milestone.isCompleted && (
              <button
                type="button"
                onClick={() => onComplete(milestone.milestoneId)}
                className="btn-secondary !py-1.5 !px-3 text-xs"
              >
                Mark complete
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(milestone.milestoneId)}
              className="btn-danger !py-1.5 !px-3 text-xs"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default MilestoneCard;
export { isOverdueMilestone };
