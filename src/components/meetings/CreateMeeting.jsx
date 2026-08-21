import React, { useState } from 'react';

const CreateMeeting = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isVirtual: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;

    onSubmit({
      ...formData,
      id: Date.now().toString(),
      status: 'upcoming',
      attendees: ['Current User'],
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-[2rem] bg-white border border-[#1B3A68]/10 shadow-[0_15px_40px_rgba(27,58,104,0.08)] max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">SCHEDULER</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-1">Schedule New Meeting</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#1B3A68] flex items-center justify-center text-[#FEF199] font-bold shadow-md">
          📅
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#1B3A68] uppercase tracking-wider mb-1.5">
            Meeting Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Sprint Review & Database Optimization"
            className="w-full text-sm font-semibold text-[#1B3A68] p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6]"
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1B3A68] uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full text-sm font-medium text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B3A68] uppercase tracking-wider mb-1.5">
              Time *
            </label>
            <input
              type="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full text-sm font-medium text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6]"
            />
          </div>
        </div>

        {/* Location / Meeting Link */}
        <div>
          <label className="block text-xs font-bold text-[#1B3A68] uppercase tracking-wider mb-1.5">
            {formData.isVirtual ? 'Virtual Link (Zoom/Google Meet)' : 'Physical Room / Location'}
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={formData.isVirtual ? 'https://meet.google.com/...' : 'Room 302, Building B'}
            className="w-full text-sm font-medium text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6]"
          />
        </div>

        {/* Virtual Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isVirtual"
            name="isVirtual"
            checked={formData.isVirtual}
            onChange={handleChange}
            className="w-4 h-4 rounded text-[#1B3A68] focus:ring-[#6FB8E6]"
          />
          <label htmlFor="isVirtual" className="text-xs font-bold text-[#1B3A68] cursor-pointer">
            This is an online video meeting
          </label>
        </div>

        {/* Description / Agenda */}
        <div>
          <label className="block text-xs font-bold text-[#1B3A68] uppercase tracking-wider mb-1.5">
            Agenda / Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline main discussion points..."
            className="w-full text-xs sm:text-sm text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6FB8E6] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1B3A68] hover:bg-[#244a7c] text-[#FEF199] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Create Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeeting;