import React from 'react';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';

const TaskCard = ({ task, onStatusChange, onDelete, onViewDetails, showActions = true }) => {
  const isOverdue = task.deadline && 
    new Date(task.deadline) < new Date() && 
    task.status !== 'COMPLETED';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md ${
      task.status === 'COMPLETED' ? 'border-green-200' :
      isOverdue ? 'border-red-200' : 'border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
        {task.projectTitle && (
          <span>📁 {task.projectTitle}</span>
        )}
        {task.teamName && (
          <span>👥 {task.teamName}</span>
        )}
        {task.assignedToName && (
          <span>👤 {task.assignedToName}</span>
        )}
        {task.deadline && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            📅 {new Date(task.deadline).toLocaleDateString()}
            {isOverdue && ' ⚠️ Overdue'}
          </span>
        )}
        {task.milestoneTitle && (
          <span>🎯 {task.milestoneTitle}</span>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails && onViewDetails(task.taskId)}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            View Details
          </button>
          {task.status !== 'COMPLETED' && (
            <select
              onChange={(e) => onStatusChange(task.taskId, e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              value={task.status}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">In Review</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Completed</option>
            </select>
          )}
          <button
            onClick={() => onDelete(task.taskId)}
            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;