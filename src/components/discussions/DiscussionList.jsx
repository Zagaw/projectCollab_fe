import React, { useState } from 'react';
import DiscussionItem from './DiscussionItem';

const DiscussionList = ({ discussions = [], onDelete, onLike, onReply }) => {
  const [filter, setFilter] = useState('All');

  const filteredDiscussions = filter === 'All' 
    ? discussions 
    : discussions.filter((item) => item.tag === filter);

  if (!discussions || discussions.length === 0) {
    return (
      <div className="relative overflow-hidden py-14 px-6 text-center rounded-3xl bg-gradient-to-b from-[#f7f9fc] to-slate-50 border border-dashed border-[#1B3A68]/15 shadow-inner">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#6FB8E6]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#1B3A68]/10 flex items-center justify-center text-[#ECB44D] text-3xl mb-4">
            <span className="animate-pulse">📢</span>
          </div>
          <h3 className="text-[#1B3A68] font-bold text-lg tracking-tight">
            No discussion topics yet
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Start a new thread above to get feedback or collaborate with your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filter Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1B3A68] tracking-wider uppercase">
            Discussions
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1B3A68]/10 text-[#1B3A68] font-black text-[11px]">
            {filteredDiscussions.length}
          </span>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'General', 'Question', 'Feedback', 'Announcement'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 ${
                filter === category
                  ? 'bg-[#1B3A68] text-[#FEF199] shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion List Stream */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <DiscussionItem
            key={discussion.id}
            discussion={discussion}
            onDelete={onDelete}
            onLike={onLike}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscussionList;