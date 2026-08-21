import React from 'react';

const MeetingCard = ({ meeting, onSelect, onDelete }) => {
  const isUpcoming = meeting.status === 'upcoming';
  const isCompleted = meeting.status === 'completed';

  return (
    <div className="group relative p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#1B3A68]/10 hover:border-[#6FB8E6]/50 hover:shadow-xl hover:shadow-[#1B3A68]/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      {/* Top Header & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1B3A68] text-[#FEF199] flex items-center justify-center text-xl shadow-md ring-2 ring-[#FEF199]/40">
            {meeting.isVirtual ? '📹' : '🤝'}
          </div>
          <div>
            <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isUpcoming 
                ? 'bg-emerald-100 text-emerald-800' 
                : isCompleted 
                ? 'bg-slate-100 text-slate-600' 
                : 'bg-[#ECB44D]/20 text-[#1B3A68]'
            }`}>
              {meeting.status || 'Upcoming'}
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {meeting.date} • {meeting.time}
            </p>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(meeting.id);
            }}
            className="opacity-80 group-hover:opacity-100 p-2 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-200 active:scale-95"
            title="Cancel Meeting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Meeting Info */}
      <div className="space-y-1.5 cursor-pointer" onClick={() => onSelect && onSelect(meeting)}>
        <h3 className="text-base sm:text-lg font-bold text-[#1B3A68] group-hover:text-[#6FB8E6] transition-colors leading-snug">
          {meeting.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {meeting.description || 'No agenda specified for this session.'}
        </p>
      </div>

      {/* Participants & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Attendees Stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(meeting.attendees || ['A', 'B', 'C']).slice(0, 3).map((name, idx) => (
              <div 
                key={idx}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B3A68] to-[#244a7c] text-[#FEF199] text-[10px] font-black border-2 border-white flex items-center justify-center shadow-sm"
              >
                {typeof name === 'string' ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            {meeting.attendees?.length || 3} members
          </span>
        </div>

        {/* View / Join Action */}
        <button
          onClick={() => onSelect && onSelect(meeting)}
          className="px-3.5 py-1.5 rounded-xl bg-[#1B3A68]/10 hover:bg-[#1B3A68] text-[#1B3A68] hover:text-[#FEF199] font-bold text-xs transition-all duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default MeetingCard;