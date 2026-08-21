import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments = [], onDelete, onReply }) => {
  // Empty State View
  if (!comments || comments.length === 0) {
    return (
      <div className="relative overflow-hidden py-12 px-6 text-center rounded-3xl bg-gradient-to-b from-[#f7f9fc] to-slate-50 border border-dashed border-[#1B3A68]/15 shadow-inner">
        {/* Decorative Background Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#6FB8E6]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-[#1B3A68]/10 flex items-center justify-center text-[#ECB44D] text-2xl mb-4 group hover:scale-105 transition-transform duration-300">
            <span className="animate-pulse">✦</span>
          </div>

          <h3 className="text-[#1B3A68] font-bold text-base sm:text-lg tracking-tight">
            No discussions yet
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Be the first to share feedback, ask a question, or start a discussion above.
          </p>
        </div>
      </div>
    );
  }

  // Count total top-level comments and nested replies
  const getTotalCount = (list) => {
    return list.reduce((acc, curr) => {
      const repliesCount = curr.replies ? getTotalCount(curr.replies) : 0;
      return acc + 1 + repliesCount;
    }, 0);
  };

  const totalComments = getTotalCount(comments);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1B3A68] tracking-wider uppercase">
            Discussion Thread
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1B3A68]/10 text-[#1B3A68] font-black text-[11px]">
            {totalComments}
          </span>
        </div>

        <span className="text-[11px] font-medium text-slate-400">
          Sorted by newest
        </span>
      </div>

      {/* Rendered List */}
      <div className="space-y-4 pt-1">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDelete}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;