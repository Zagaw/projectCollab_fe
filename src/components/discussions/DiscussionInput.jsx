import React, { useState } from 'react';

const DiscussionInput = ({ onSubmit, placeholder = 'Start a new discussion thread...' }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [tag, setTag] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({ title, content, tag });
    setTitle('');
    setContent('');
    setTag('General');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div 
        className={`relative overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
          isFocused 
            ? 'border-[#6FB8E6] ring-4 ring-[#6FB8E6]/20 shadow-xl' 
            : 'border-[#1B3A68]/15 shadow-sm hover:border-[#1B3A68]/30'
        }`}
      >
        {/* Decorative Top Gradient Line */}
        <div 
          className={`h-1 bg-gradient-to-r from-[#1B3A68] via-[#6FB8E6] to-[#ECB44D] transition-opacity duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-4 sm:p-5 space-y-3">
          {/* Tag Selector & Status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#ECB44D] text-xs font-bold">✦ CATEGORY</span>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="text-xs font-bold bg-[#f7f9fc] text-[#1B3A68] border border-[#1B3A68]/10 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#6FB8E6]"
              >
                <option value="General">General</option>
                <option value="Question">Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Markdown supported</span>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Discussion Title..."
            className="w-full text-sm sm:text-base font-bold text-[#1B3A68] placeholder-slate-400 focus:outline-none bg-transparent border-b border-slate-100 pb-2"
          />

          {/* Content Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={4}
            className="w-full text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none resize-none bg-transparent leading-relaxed"
          />
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            💬 <span className="hidden sm:inline text-[11px]">Share ideas with your team</span>
          </div>

          <div className="flex items-center gap-2">
            {(title.length > 0 || content.length > 0) && (
              <button
                type="button"
                onClick={() => { setTitle(''); setContent(''); }}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-6 py-2 rounded-xl bg-[#1B3A68] hover:bg-[#244a7c] text-[#FEF199] font-bold text-xs sm:text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span>Post Topic</span>
              <span className="text-[#FEF199]">✦</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DiscussionInput;