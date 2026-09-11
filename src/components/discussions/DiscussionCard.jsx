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

  const replyCount = discussion.replyCount ?? discussion.replies?.length ?? 0;

  return (
    <article
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="surface p-4 sm:p-5 hover:border-indigo-200 transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink hover:text-indigo-700">
            {discussion.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {discussion.content}
          </p>
        </div>
        <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md shrink-0">
          {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
            <span className="text-indigo-700 font-semibold text-xs">
              {getInitials(discussion.createdByName)}
            </span>
          </div>
          <span className="text-sm text-gray-600">{discussion.createdByName || 'Unknown'}</span>
        </div>
        <span className="text-sm text-gray-500">{getTimeAgo(discussion.createdAt)}</span>
        {discussion.replies && discussion.replies.length > 0 && (
          <span className="text-sm text-gray-500">
            Last reply {getTimeAgo(discussion.replies[discussion.replies.length - 1]?.createdAt)}
          </span>
        )}
        <span className="ml-auto text-sm font-medium text-indigo-700">Open thread</span>
      </div>
    </article>
  );
};

export default DiscussionCard;
