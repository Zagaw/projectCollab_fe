import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  formatMeetingTime,
  meetingBasePath,
  rsvpLabel,
  statusBadgeClass,
  toApiDateTime,
  toDatetimeLocal,
} from './meetingUtils';

const RSVP_OPTIONS = [
  { id: 'GOING', label: 'Going' },
  { id: 'MAYBE', label: 'Maybe' },
  { id: 'NOT_GOING', label: 'Not going' },
];

const MeetingDetails = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const basePath = meetingBasePath();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [minutes, setMinutes] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    agenda: '',
    startAt: '',
    endAt: '',
    location: '',
    meetingLink: '',
  });

  useEffect(() => {
    fetchMeeting();
  }, [meetingId]);

  const applyMeeting = (data) => {
    setMeeting(data);
    setMinutes(data.minutes || '');
    setFormData({
      title: data.title || '',
      agenda: data.agenda || '',
      startAt: toDatetimeLocal(data.startAt),
      endAt: toDatetimeLocal(data.endAt),
      location: data.location || '',
      meetingLink: data.meetingLink || '',
    });
  };

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const response = await meetingApi.getMeetingById(meetingId);
      applyMeeting(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load meeting');
      navigate(`${basePath}/meetings`);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (response) => {
    try {
      const result = await meetingApi.rsvp(meetingId, response);
      applyMeeting(result.data);
      toast.success('RSVP saved');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save RSVP');
    }
  };

  const handleSaveMinutes = async () => {
    if (!minutes.trim()) {
      toast.error('Minutes cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const result = await meetingApi.saveMinutes(meetingId, minutes.trim());
      applyMeeting(result.data);
      toast.success('Minutes saved');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save minutes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMeeting = async () => {
    if (!window.confirm('Cancel this meeting? Members will be notified.')) return;
    setSaving(true);
    try {
      const result = await meetingApi.cancelMeeting(meetingId);
      applyMeeting(result.data);
      setEditing(false);
      toast.success('Meeting cancelled');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel meeting');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startAt || !formData.endAt) {
      toast.error('Title, start time, and end time are required');
      return;
    }
    if (new Date(formData.endAt) <= new Date(formData.startAt)) {
      toast.error('End time must be after start time');
      return;
    }
    setSaving(true);
    try {
      const result = await meetingApi.updateMeeting(meetingId, {
        title: formData.title.trim(),
        agenda: formData.agenda.trim() || null,
        startAt: toApiDateTime(formData.startAt),
        endAt: toApiDateTime(formData.endAt),
        location: formData.location.trim() || null,
        meetingLink: formData.meetingLink.trim() || null,
      });
      applyMeeting(result.data);
      setEditing(false);
      toast.success('Meeting updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update meeting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!meeting) return null;

  const cancelled = meeting.status === 'CANCELLED';
  const canManage = Boolean(meeting.canManage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(`${basePath}/meetings`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition mt-1"
          >
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(meeting.status)}`}>
                {meeting.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              {meeting.teamName} • {meeting.projectTitle}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Scheduled by {meeting.createdByName}
            </p>
          </div>
        </div>
        {canManage && !cancelled && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              {editing ? 'Close editor' : 'Edit'}
            </button>
            <button
              type="button"
              onClick={handleCancelMeeting}
              disabled={saving}
              className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100"
            >
              Cancel meeting
            </button>
          </div>
        )}
      </div>

      {editing && canManage && !cancelled && (
        <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Update meeting</h2>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            placeholder="Title"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="datetime-local"
              value={formData.endAt}
              onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>
          <input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            placeholder="Location"
          />
          <input
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            placeholder="Meeting link"
          />
          <textarea
            value={formData.agenda}
            onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            placeholder="Agenda"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Save changes
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <p className="text-sm text-gray-500">When</p>
            <p className="text-gray-900 font-medium">
              {formatMeetingTime(meeting.startAt)} – {formatMeetingTime(meeting.endAt)}
            </p>
            {meeting.location && (
              <>
                <p className="text-sm text-gray-500 pt-2">Location</p>
                <p className="text-gray-900">{meeting.location}</p>
              </>
            )}
            {meeting.meetingLink && (
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Join meeting
              </a>
            )}
            {!meeting.meetingLink && (
              <p className="text-sm text-gray-500">No external meeting link was added.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Agenda</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {meeting.agenda || 'No agenda provided.'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Minutes</h2>
            {canManage && !cancelled ? (
              <>
                <textarea
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Record what was discussed after the meeting"
                />
                <button
                  type="button"
                  onClick={handleSaveMinutes}
                  disabled={saving}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Save minutes
                </button>
                <p className="text-xs text-gray-500 mt-2">Saving minutes marks this meeting as completed.</p>
              </>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {meeting.minutes || 'Minutes have not been posted yet.'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Your RSVP</h2>
            {cancelled ? (
              <p className="text-sm text-gray-500">This meeting was cancelled.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {RSVP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleRsvp(option.id)}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      meeting.myRsvp === option.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Attendees</h2>
            {(meeting.attendees || []).length === 0 ? (
              <p className="text-sm text-gray-500">No RSVPs yet.</p>
            ) : (
              <ul className="space-y-2">
                {meeting.attendees.map((attendee) => (
                  <li key={attendee.attendeeId || attendee.userId} className="text-sm">
                    <span className="font-medium text-gray-900">{attendee.userName}</span>
                    <span className="text-gray-500"> — {rsvpLabel(attendee.response)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
