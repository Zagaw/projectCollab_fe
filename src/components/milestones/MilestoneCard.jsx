import React from 'react';

const MilestoneCard = ({ milestone, onComplete, onDelete, onViewDetails, showActions = true }) => {
  const isOverdue = milestone.deadline && 
    new Date(milestone.deadline) < new Date() && 
    !milestone.isCompleted;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
      milestone.isCompleted ? 'border-green-200' : 
      isOverdue ? 'border-red-200' : 'border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {milestone.title}
          </h3>
          {milestone.projectTitle && (
            <p className="text-sm text-gray-500">
              Project: {milestone.projectTitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {milestone.isCompleted ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              ✅ Completed
            </span>
          ) : isOverdue ? (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              ⚠️ Overdue
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              ⏳ In Progress
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {milestone.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {milestone.description}
        </p>
      )}

      {/* Deadline */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>Deadline: {new Date(milestone.deadline).toLocaleDateString()}</span>
        </div>
        {milestone.completedAt && (
          <div className="flex items-center gap-1">
            <span>✅</span>
            <span>Completed: {new Date(milestone.completedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* ✅ FIX: View Details button is ALWAYS visible for everyone */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewDetails && onViewDetails(milestone.milestoneId)}
          className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          View Details
        </button>
        
        {/* Actions only for team leaders */}
        {showActions && (
          <>
            {!milestone.isCompleted && (
              <button
                onClick={() => onComplete(milestone.milestoneId)}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => onDelete(milestone.milestoneId)}
              className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;