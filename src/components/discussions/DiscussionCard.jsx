import React from 'react';

const DiscussionCard = ({ discussion, onView }) => {
  const getTimeAgo = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getInitials = (name) => {
    return name?.charAt(0) || 'U';
  };

  const handleClick = () => {
    if (onView) {
      onView(discussion.discussionId);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
            {discussion.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {discussion.content}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            💬 {discussion.replies?.length || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-xs">
              {getInitials(discussion.createdByName)}
            </span>
          </div>
          <span className="text-sm text-gray-600">{discussion.createdByName || 'Unknown'}</span>
        </div>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-400">{getTimeAgo(discussion.createdAt)}</span>
        {discussion.replies && discussion.replies.length > 0 && (
          <>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">
              Last reply {getTimeAgo(discussion.replies[discussion.replies.length - 1]?.createdAt)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscussionCard;