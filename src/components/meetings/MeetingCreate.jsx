import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';
import { toApiDateTime } from './meetingUtils';

const MeetingCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetTeamId = searchParams.get('teamId') || '';

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    teamId: presetTeamId,
    title: '',
    agenda: '',
    startAt: '',
    endAt: '',
    location: '',
    meetingLink: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamApi.getMyTeams();
      setTeams(response.data || []);
    } catch (error) {
      toast.error('Failed to load teams');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId) {
      toast.error('Please select a team');
      return;
    }
    if (!formData.title.trim() || !formData.startAt || !formData.endAt) {
      toast.error('Title, start time, and end time are required');
      return;
    }
    if (new Date(formData.endAt) <= new Date(formData.startAt)) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const response = await meetingApi.createMeeting(formData.teamId, {
        title: formData.title.trim(),
        agenda: formData.agenda.trim() || null,
        startAt: toApiDateTime(formData.startAt),
        endAt: toApiDateTime(formData.endAt),
        location: formData.location.trim() || null,
        meetingLink: formData.meetingLink.trim() || null,
      });
      toast.success('Meeting scheduled');
      navigate(`/teamleader/meetings/${response.data.meetingId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/teamleader/meetings')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule meeting</h1>
          <p className="text-gray-600">Share an agenda and an external meeting link. Collabora does not host video calls.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team *</label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.name}{team.projectTitle ? ` — ${team.projectTitle}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Sprint check-in"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start *</label>
            <input
              type="datetime-local"
              name="startAt"
              value={formData.startAt}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End *</label>
            <input
              type="datetime-local"
              name="endAt"
              value={formData.endAt}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Lab 3 or leave blank for online"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting link</label>
          <input
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="https://meet.google.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">Zoom, Google Meet, Teams, or any URL. Opens in a new tab.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Topics to cover"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/teamleader/meetings')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingCreate;
