import React from 'react';
import { Link } from 'react-router-dom';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';

const isOverdueTask = (task) =>
  task.deadline && new Date(task.deadline) < new Date() && task.status !== 'COMPLETED';

const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
  onViewDetails,
  detailsTo,
  showActions = true,
  compact = false,
  canDelete = false,
}) => {
  const overdue = isOverdueTask(task);
  const href = detailsTo;
  const canOpen = Boolean(href || onViewDetails);

  const openDetails = (e) => {
    if (e) e.stopPropagation();
    if (onViewDetails) onViewDetails(task.taskId);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <article
      className={`${compact ? 'bg-gray-50 border border-gray-200 rounded-xl p-3' : 'surface p-4'} ${overdue ? 'border-red-200' : ''} ${canOpen ? 'hover:border-indigo-200' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        {href ? (
          <Link
            to={href}
            className="text-left font-semibold text-ink hover:text-indigo-700 min-w-0 flex-1"
          >
            {task.title}
          </Link>
        ) : (
          <button
            type="button"
            onClick={openDetails}
            disabled={!canOpen}
            className="text-left font-semibold text-ink hover:text-indigo-700 min-w-0 flex-1"
          >
            {task.title}
          </button>
        )}
        <TaskPriorityBadge priority={task.priority} />
      </div>
      {task.description && !compact && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.assignedToName && (
          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{task.assignedToName}</span>
        )}
        {task.teamName && (
          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{task.teamName}</span>
        )}
        {task.deadline && (
          <span className={`text-xs px-2 py-1 rounded-md ${overdue ? 'bg-red-50 text-red-700 font-medium' : 'bg-gray-50 text-gray-600'}`}>
            {new Date(task.deadline).toLocaleDateString()}
            {overdue ? ' · overdue' : ''}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <TaskStatusBadge status={task.status} />
        <div className="flex items-center gap-1.5">
          {showActions && task.status !== 'COMPLETED' && onStatusChange && (
            <select
              aria-label="Update status"
              onClick={stop}
              onChange={(e) => onStatusChange(task.taskId, e.target.value)}
              className="field !py-1 !px-2 text-xs max-w-[8.5rem]"
              value={task.status}
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="REVIEW">Review</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Done</option>
            </select>
          )}
          {canDelete && onDelete && (
            <button type="button" onClick={(e) => { stop(e); onDelete(task.taskId); }} className="btn-danger !py-1 !px-2 text-xs">
              Delete
            </button>
          )}
        </div>
      </div>
      {canOpen && (
        <div className="mt-3">
          {href ? (
            <Link to={href} className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
              View details
            </Link>
          ) : (
            <button type="button" onClick={openDetails} className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
              View details
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default TaskCard;
export { isOverdueTask };
