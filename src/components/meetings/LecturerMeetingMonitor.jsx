import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, StatCard, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { formatMeetingTime, statusBadgeClass } from './meetingUtils';
import { Video, CalendarCheck, CircleCheck, Ban } from 'lucide-react';

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
      <PageHeader
        icon={Video}
        title="Meetings"
        description="Monitor team meetings across your projects. Leaders schedule meetings and store minutes; you can view, RSVP, and open the shared link."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Video} label="Meetings" value={stats.total} />
        <StatCard icon={CalendarCheck} tone="sky" label="Scheduled" value={stats.scheduled} />
        <StatCard icon={CircleCheck} tone="violet" label="Completed" value={stats.completed} />
        <StatCard icon={Ban} label="Cancelled" value={stats.cancelled} warn={stats.cancelled > 0} />
      </div>

      <div className="surface p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="mtg-monitor-project">Project</label>
            <select
              id="mtg-monitor-project"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setTeamId('ALL');
              }}
              className="field"
            >
              <option value="ALL">All projects</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>{project.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="mtg-monitor-team">Team</label>
            <select
              id="mtg-monitor-team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="field"
            >
              <option value="ALL">All teams</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.name}{projectId === 'ALL' && team.projectTitle ? ` (${team.projectTitle})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        <FilterChips value={filter} onChange={setFilter} options={FILTERS} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No meetings"
          description="Teams have not scheduled meetings for this filter yet."
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, items]) => {
            const [projectTitle, teamName] = key.split(':::');
            return (
              <section key={key}>
                <h2 className="text-lg font-semibold text-ink mb-3">
                  {teamName}
                  <span className="text-sm font-normal text-gray-500 ml-2">{projectTitle}</span>
                </h2>
                <div className="space-y-3">
                  {items.map((meeting) => (
                    <button
                      key={meeting.meetingId}
                      type="button"
                      onClick={() => navigate(`/lecturer/meetings/${meeting.meetingId}`)}
                      className="w-full text-left surface p-4 sm:p-5 hover:border-indigo-200 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{meeting.title}</p>
                          <p className="text-sm text-ink mt-2">
                            {formatMeetingTime(meeting.startAt)} – {formatMeetingTime(meeting.endAt)}
                          </p>
                          {meeting.location && (
                            <p className="text-xs text-gray-500 mt-1">{meeting.location}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(meeting.status)}`}>
                            {meeting.status}
                          </span>
                          {meeting.meetingLink && (
                            <span className="text-xs text-indigo-700">Has join link</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LecturerMeetingMonitor;
