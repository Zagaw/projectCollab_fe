import React, { useState } from 'react';

const MeetingMinutes = ({ meetingId, initialMinutes = '', onSave }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (onSave) onSave(meetingId, minutes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1B3A68]">Meeting Minutes & Summary</h3>
          <p className="text-xs text-slate-400">Record discussion outcomes, decisions, and action items.</p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-[#1B3A68] hover:bg-[#244a7c] text-[#FEF199] font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
        >
          <span>{isSaved ? 'Saved! ✓' : 'Save Minutes'}</span>
        </button>
      </div>

      <textarea
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        rows={10}
        placeholder="Key Takeaways:&#10;- Decision A...&#10;- Action item assigned to..."
        className="w-full text-xs sm:text-sm text-slate-700 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6] leading-relaxed resize-y"
      />
    </div>
  );
};

export default MeetingMinutes;