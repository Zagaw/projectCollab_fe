import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';
import { toApiDateTime } from './meetingUtils';
import { PageHeader } from '../common/PageHeader';

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
    <div className="max-w-3xl">
      <PageHeader
        title="Schedule meeting"
        description="Share an agenda and an external meeting link. Collabora does not host video calls."
        actions={
          <button type="button" onClick={() => navigate('/teamleader/meetings')} className="btn-secondary">
            Cancel
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        <div>
          <label className="label" htmlFor="meeting-create-team">Team *</label>
          <select
            id="meeting-create-team"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            className="field"
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
          <label className="label" htmlFor="meeting-create-title">Title *</label>
          <input
            id="meeting-create-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="field"
            placeholder="Sprint check-in"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="meeting-create-start">Start *</label>
            <input
              id="meeting-create-start"
              type="datetime-local"
              name="startAt"
              value={formData.startAt}
              onChange={handleChange}
              className="field"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="meeting-create-end">End *</label>
            <input
              id="meeting-create-end"
              type="datetime-local"
              name="endAt"
              value={formData.endAt}
              onChange={handleChange}
              className="field"
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="meeting-create-location">Location</label>
          <input
            id="meeting-create-location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="field"
            placeholder="Lab 3 or leave blank for online"
          />
        </div>

        <div>
          <label className="label" htmlFor="meeting-create-link">Meeting link</label>
          <input
            id="meeting-create-link"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            className="field"
            placeholder="https://meet.google.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">Zoom, Google Meet, Teams, or any URL. Opens in a new tab.</p>
        </div>

        <div>
          <label className="label" htmlFor="meeting-create-agenda">Agenda</label>
          <textarea
            id="meeting-create-agenda"
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            rows={5}
            className="field"
            placeholder="Topics to cover"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Scheduling...' : 'Schedule meeting'}
          </button>
          <button type="button" onClick={() => navigate('/teamleader/meetings')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingCreate;
