import React, { useState } from 'react';
import CommentInput from './CommentInput';

const CommentItem = ({ comment, onDelete, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = (text) => {
    if (onReply) {
      onReply(comment.id, text);
    }
    setIsReplying(false);
  };

  const authorInitial = comment.author ? comment.author.charAt(0).toUpperCase() : 'U';

  return (
    <div className="group relative p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#1B3A68]/10 hover:border-[#6FB8E6]/50 hover:bg-white hover:shadow-xl hover:shadow-[#1B3A68]/5 transition-all duration-300 space-y-3">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B3A68] to-[#244a7c] text-[#FEF199] flex items-center justify-center font-black text-sm shadow-md ring-2 ring-[#FEF199]/40">
              {authorInitial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#1B3A68] text-xs sm:text-sm tracking-tight">
                {comment.author || 'Anonymous User'}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECB44D]/15 text-[#1B3A68] font-bold">
                Member
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {comment.createdAt || 'Just now'}
            </p>
          </div>
        </div>

        {/* Delete Action Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="opacity-80 group-hover:opacity-100 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white text-xs font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            title="Delete Comment"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>

      {/* Comment Body */}
      <div className="sm:pl-13">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3 sm:p-3.5 rounded-xl border border-slate-100">
          {comment.text}
        </p>
      </div>

      {/* Action Bar */}
      <div className="sm:pl-13 flex items-center gap-3 pt-1">
        <button
          onClick={() => setIsReplying(!isReplying)}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
            isReplying
              ? 'bg-[#1B3A68] text-[#FEF199]'
              : 'text-[#1B3A68] hover:bg-[#6FB8E6]/15 hover:text-[#1B3A68]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          {isReplying ? 'Cancel Reply' : 'Reply'}
        </button>
      </div>

      {/* Inline Reply Form */}
      {isReplying && (
        <div className="sm:pl-13 pt-2 animate-fadeIn">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-[#6FB8E6]/30">
            <CommentInput
              onSubmit={handleReplySubmit}
              placeholder={`Replying to @${comment.author || 'comment'}...`}
            />
          </div>
        </div>
      )}

      {/* Nested Replies Chain */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 sm:ml-8 pl-4 sm:pl-6 space-y-3 pt-3 border-l-2 border-[#6FB8E6]/30 hover:border-[#6FB8E6] transition-colors">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;