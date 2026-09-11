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
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/meetings`)}
            className="text-sm text-indigo-700 hover:text-indigo-800 mb-2"
          >
            Back to meetings
          </button>
          <h1 className="page-title">{meeting.title}</h1>
          <p className="page-kicker">
            {meeting.teamName} · {meeting.projectTitle}
          </p>
          <p className="text-sm text-gray-500 mt-1">Scheduled by {meeting.createdByName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(meeting.status)}`}>
            {meeting.status}
          </span>
          {canManage && !cancelled && (
            <>
              <button type="button" onClick={() => setEditing((value) => !value)} className="btn-secondary">
                {editing ? 'Close editor' : 'Edit'}
              </button>
              <button type="button" onClick={handleCancelMeeting} disabled={saving} className="btn-danger">
                Cancel meeting
              </button>
            </>
          )}
        </div>
      </div>

      {editing && canManage && !cancelled && (
        <form onSubmit={handleUpdate} className="surface p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-ink">Update meeting</h2>
          <div>
            <label className="label" htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="field"
              placeholder="Title"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="edit-start">Start</label>
              <input
                id="edit-start"
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="edit-end">End</label>
              <input
                id="edit-end"
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                className="field"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="edit-location">Location</label>
            <input
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="field"
              placeholder="Location"
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-link">Meeting link</label>
            <input
              id="edit-link"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className="field"
              placeholder="Meeting link"
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-agenda">Agenda</label>
            <textarea
              id="edit-agenda"
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              rows={4}
              className="field"
              placeholder="Agenda"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            Save changes
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="surface p-5 sm:p-6 space-y-3">
            <p className="text-sm text-gray-500">When</p>
            <p className="text-ink font-medium">
              {formatMeetingTime(meeting.startAt)} – {formatMeetingTime(meeting.endAt)}
            </p>
            {meeting.location && (
              <>
                <p className="text-sm text-gray-500 pt-2">Location</p>
                <p className="text-ink">{meeting.location}</p>
              </>
            )}
            {meeting.meetingLink ? (
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-3 self-start"
              >
                Join meeting
              </a>
            ) : (
              <p className="text-sm text-gray-500">No external meeting link was added.</p>
            )}
          </div>

          <div className="surface p-5 sm:p-6">
            <h2 className="font-semibold text-ink mb-2">Agenda</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {meeting.agenda || 'No agenda provided.'}
            </p>
          </div>

          <div className="surface p-5 sm:p-6">
            <h2 className="font-semibold text-ink mb-2">Minutes</h2>
            {canManage && !cancelled ? (
              <>
                <textarea
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  rows={8}
                  className="field"
                  placeholder="Record what was discussed after the meeting"
                />
                <button
                  type="button"
                  onClick={handleSaveMinutes}
                  disabled={saving}
                  className="btn-primary mt-3"
                >
                  Save minutes
                </button>
                <p className="text-xs text-gray-500 mt-2">Saving minutes marks this meeting as completed.</p>
              </>
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {meeting.minutes || 'Minutes have not been posted yet.'}
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="surface p-5 sm:p-6">
            <h2 className="font-semibold text-ink mb-3">Your RSVP</h2>
            {cancelled ? (
              <p className="text-sm text-gray-500">This meeting was cancelled.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {RSVP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleRsvp(option.id)}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg ${
                      meeting.myRsvp === option.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="surface p-5 sm:p-6">
            <h2 className="font-semibold text-ink mb-3">Attendees</h2>
            {(meeting.attendees || []).length === 0 ? (
              <p className="text-sm text-gray-500">No RSVPs yet.</p>
            ) : (
              <ul className="space-y-2">
                {meeting.attendees.map((attendee) => (
                  <li key={attendee.attendeeId || attendee.userId} className="text-sm">
                    <span className="font-medium text-ink">{attendee.userName}</span>
                    <span className="text-gray-500"> — {rsvpLabel(attendee.response)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MeetingDetails;
