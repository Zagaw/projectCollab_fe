import React, { useState } from 'react';

const DiscussionItem = ({ discussion, onDelete, onLike, onReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReply) onReply(discussion.id, replyText);
    setReplyText('');
    setShowReplyInput(false);
  };

  const authorInitial = discussion.author ? discussion.author.charAt(0).toUpperCase() : 'U';

  return (
    <div className="group relative p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#1B3A68]/10 hover:border-[#6FB8E6]/50 hover:shadow-xl hover:shadow-[#1B3A68]/5 transition-all duration-300 space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1B3A68] to-[#244a7c] text-[#FEF199] flex items-center justify-center font-black text-base shadow-md ring-2 ring-[#FEF199]/40">
              {authorInitial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[#1B3A68] text-xs sm:text-sm tracking-tight">
                {discussion.author || 'Anonymous'}
              </h4>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ECB44D]/15 text-[#1B3A68] font-bold">
                {discussion.tag || 'General'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {discussion.createdAt || 'Just now'}
            </p>
          </div>
        </div>

        {/* Delete Action Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(discussion.id)}
            className="opacity-80 group-hover:opacity-100 p-2 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-200 active:scale-95"
            title="Delete Topic"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Discussion Title & Content */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-[#1B3A68] leading-snug">
          {discussion.title}
        </h3>
        <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${!isExpanded && 'line-clamp-3'}`}>
          {discussion.content}
        </p>
        {discussion.content && discussion.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[#6FB8E6] hover:text-[#1B3A68] transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => onLike && onLike(discussion.id)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors py-1 px-2.5 rounded-lg hover:bg-red-50"
          >
            <span>❤️</span>
            <span>{discussion.likes || 0}</span>
          </button>

          {/* Reply Toggle */}
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-1.5 text-[#1B3A68] hover:text-[#6FB8E6] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#6FB8E6]/10"
          >
            <span>💬</span>
            <span>{discussion.replies ? discussion.replies.length : 0} Replies</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Topic #{discussion.id}
        </span>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <form onSubmit={handleReplySubmit} className="pt-2 animate-fadeIn">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a quick response..."
              className="flex-1 p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-[#1B3A68] focus:outline-none focus:ring-2 focus:ring-[#6FB8E6]"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2.5 bg-[#1B3A68] text-[#FEF199] font-bold rounded-xl text-xs disabled:opacity-40"
            >
              Reply
            </button>
          </div>
        </form>
      )}

      {/* Replies Stream */}
      {discussion.replies && discussion.replies.length > 0 && (
        <div className="space-y-2.5 pt-3 border-l-2 border-[#6FB8E6]/30 pl-4 sm:pl-6 ml-2">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1B3A68]">{reply.author || 'Member'}</span>
                <span className="text-[10px] text-slate-400">{reply.createdAt || 'Just now'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionItem;