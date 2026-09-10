import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';
import { formatMeetingTime, statusBadgeClass } from './meetingUtils';

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
];

const LecturerMeetingMonitor = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meetingRes, projectRes] = await Promise.all([
        meetingApi.getLecturerMeetings(filter),
        projectApi.getMyProjects(),
      ]);
      setMeetings(meetingRes.data || []);
      setProjects(projectRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const teams = useMemo(() => {
    const source = projectId === 'ALL'
      ? meetings
      : meetings.filter((m) => String(m.projectId) === String(projectId));
    const map = {};
    source.forEach((m) => {
      if (m.teamId && !map[m.teamId]) {
        map[m.teamId] = { teamId: m.teamId, name: m.teamName, projectTitle: m.projectTitle };
      }
    });
    return Object.values(map);
  }, [meetings, projectId]);

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (projectId !== 'ALL' && String(m.projectId) !== String(projectId)) return false;
      if (teamId !== 'ALL' && String(m.teamId) !== String(teamId)) return false;
      return true;
    });
  }, [meetings, projectId, teamId]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((m) => {
      const key = `${m.projectTitle || 'Project'}:::${m.teamName || 'Team'}`;
      if (!map[key]) map[key] = [];
      map[key].push(m);
    });
    return Object.entries(map);
  }, [filtered]);

  const stats = {
    total: filtered.length,
    scheduled: filtered.filter((m) => m.status === 'SCHEDULED').length,
    completed: filtered.filter((m) => m.status === 'COMPLETED').length,
    cancelled: filtered.filter((m) => m.status === 'CANCELLED').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-600 mt-1">
          Monitor team meetings across your projects. Leaders schedule meetings and store minutes; you can view, RSVP, and open the shared link.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500">Meetings</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-3">
        <select
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setTeamId('ALL');
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
        >
          <option value="ALL">All projects</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>{project.title}</option>
          ))}
        </select>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
        >
          <option value="ALL">All teams</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.name}{projectId === 'ALL' && team.projectTitle ? ` (${team.projectTitle})` : ''}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No meetings"
          description="Teams have not scheduled meetings for this filter yet."
          icon="📅"
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([key, items]) => {
            const [projectTitle, teamName] = key.split(':::');
            return (
              <div key={key}>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  {projectTitle} • {teamName}
                </h2>
                <div className="space-y-3">
                  {items.map((meeting) => (
                    <button
                      key={meeting.meetingId}
                      type="button"
                      onClick={() => navigate(`/lecturer/meetings/${meeting.meetingId}`)}
                      className="w-full text-left bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{meeting.title}</p>
                          <p className="text-sm text-gray-700 mt-2">
                            {formatMeetingTime(meeting.startAt)} – {formatMeetingTime(meeting.endAt)}
                          </p>
                          {meeting.location && (
                            <p className="text-xs text-gray-500 mt-1">{meeting.location}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(meeting.status)}`}>
                            {meeting.status}
                          </span>
                          {meeting.meetingLink && (
                            <span className="text-xs text-indigo-600">Has join link</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LecturerMeetingMonitor;
