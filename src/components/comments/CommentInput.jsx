import React, { useState } from 'react';

const CommentInput = ({ onSubmit, placeholder = 'Write a comment...' }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div 
        className={`relative overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
          isFocused 
            ? 'border-[#6FB8E6] ring-4 ring-[#6FB8E6]/20 shadow-lg' 
            : 'border-[#1B3A68]/15 shadow-sm hover:border-[#1B3A68]/30'
        }`}
      >
        {/* Accent Bar */}
        <div 
          className={`h-1 bg-gradient-to-r from-[#1B3A68] via-[#6FB8E6] to-[#ECB44D] transition-opacity duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Text Area Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={3}
          className="w-full p-4 text-[#1B3A68] placeholder-slate-400 text-xs sm:text-sm focus:outline-none resize-none bg-transparent"
        />

        {/* Bottom Toolbar & Character Count */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-slate-100/80 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-[#ECB44D] text-xs">✦</span>
            <span className="text-[11px] font-medium text-slate-400">Markdown supported</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-semibold ${
              text.length >= maxLength ? 'text-red-500' : 'text-slate-400'
            }`}>
              {text.length}/{maxLength}
            </span>

            {/* Clear Button */}
            {text.length > 0 && (
              <button
                type="button"
                onClick={() => setText('')}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-2.5 rounded-xl bg-[#1B3A68] hover:bg-[#244a7c] text-[#FEF199] font-bold text-xs sm:text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
        >
          <span>Post Comment</span>
          <span className="text-[#FEF199] text-xs">✦</span>
        </button>
      </div>
    </form>
  );
};

export default CommentInput;