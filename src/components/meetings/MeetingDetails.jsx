import React, { useState } from 'react';
import MeetingMinutes from './MeetingMinutes';

const MeetingDetails = ({ meeting, onBack, onSaveMinutes }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!meeting) return null;

  return (
    <div className="p-6 sm:p-8 rounded-[2rem] bg-white border border-[#1B3A68]/10 shadow-[0_15px_40px_rgba(27,58,104,0.08)] space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-[#1B3A68] text-slate-600 hover:text-white transition-colors"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECB44D]/20 text-[#1B3A68] uppercase tracking-wider">
              {meeting.status || 'Scheduled'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-1">
              {meeting.title}
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-[#1B3A68] text-[#FEF199]' : 'text-slate-500'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('minutes')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'minutes' ? 'bg-[#1B3A68] text-[#FEF199]' : 'text-slate-500'
            }`}
          >
            Meeting Minutes 📝
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-[#1B3A68] uppercase tracking-wider">
                Agenda & Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {meeting.description || 'No detailed agenda provided for this meeting.'}
              </p>
            </div>

            {/* Quick Actions / Link */}
            {meeting.location && (
              <div className="p-4 rounded-2xl bg-[#6FB8E6]/10 border border-[#6FB8E6]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1B3A68]">Location / Link</p>
                  <p className="text-xs text-slate-600 truncate max-w-xs sm:max-w-md">{meeting.location}</p>
                </div>
                {meeting.isVirtual && (
                  <a
                    href={meeting.location.startsWith('http') ? meeting.location : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#1B3A68] text-[#FEF199] text-xs font-bold shadow-md hover:bg-[#244a7c] transition-all"
                  >
                    Join Call 📹
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Metadata */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 h-fit">
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</h5>
              <p className="text-xs sm:text-sm font-bold text-[#1B3A68] mt-0.5">
                {meeting.date} at {meeting.time}
              </p>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attendees</h5>
              <div className="space-y-2">
                {(meeting.attendees || ['Aung Ko', 'Lecturer', 'Student User']).map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#1B3A68]">
                    <div className="w-6 h-6 rounded-lg bg-[#1B3A68] text-[#FEF199] text-[10px] flex items-center justify-center">
                      {name.charAt(0)}
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MeetingMinutes
          meetingId={meeting.id}
          initialMinutes={meeting.minutes || ''}
          onSave={onSaveMinutes}
        />
      )}
    </div>
  );
};

export default MeetingDetails;