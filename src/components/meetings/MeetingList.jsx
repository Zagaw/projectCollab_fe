import React, { useState } from 'react';
import MeetingCard from './MeetingCard';

const MeetingList = ({ meetings = [], onSelect, onDelete, onCreateClick }) => {
  const [tab, setTab] = useState('upcoming');

  const filteredMeetings = meetings.filter((m) => {
    if (tab === 'all') return true;
    return m.status === tab;
  });

  return (
    <div className="space-y-6">
      {/* List Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 pb-2 border-b border-slate-100">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">SCHEDULE</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-0.5">Project Meetings</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            {['upcoming', 'completed', 'all'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#1B3A68] text-[#FEF199] shadow-sm'
                    : 'text-slate-500 hover:text-[#1B3A68]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="px-4 py-2 rounded-xl bg-[#1B3A68] hover:bg-[#244a7c] text-[#FEF199] font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
            >
              <span>+ New Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 ? (
        <div className="relative overflow-hidden py-14 px-6 text-center rounded-3xl bg-gradient-to-b from-[#f7f9fc] to-slate-50 border border-dashed border-[#1B3A68]/15 shadow-inner">
          <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#1B3A68]/10 flex items-center justify-center text-[#ECB44D] text-3xl mb-4">
              🤝
            </div>
            <h3 className="text-[#1B3A68] font-bold text-lg tracking-tight">
              No {tab} meetings found
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Schedule a sync-up or check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        /* Grid Stream */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;