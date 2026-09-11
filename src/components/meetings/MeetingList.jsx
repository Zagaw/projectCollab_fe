import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import teamApi from '../../api/teamApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Video, CalendarPlus } from 'lucide-react';
import { formatMeetingTime, meetingBasePath, statusBadgeClass } from './meetingUtils';

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
];

const MeetingList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const basePath = meetingBasePath();
  const canCreate = basePath === '/teamleader';

  const [teams, setTeams] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(searchParams.get('teamId') || 'ALL');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'upcoming');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [selectedTeamId, filter]);

  const fetchTeams = async () => {
    try {
      const response = await teamApi.getMyTeams();
      setTeams(response.data || []);
    } catch (error) {
      toast.error('Failed to load teams');
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedTeamId && selectedTeamId !== 'ALL') {
        response = await meetingApi.getTeamMeetings(selectedTeamId, filter);
      } else {
        response = await meetingApi.getMyMeetings(filter);
      }
      setMeetings(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedTeam = useMemo(
    () => teams.find((team) => String(team.teamId) === String(selectedTeamId)),
    [teams, selectedTeamId]
  );

  const isLeaderOfSelected = Boolean(
    selectedTeam && String(selectedTeam.teamLeader?.userId) === String(user?.userId)
  );

  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId);
    const next = {};
    if (teamId && teamId !== 'ALL') next.teamId = teamId;
    if (filter && filter !== 'upcoming') next.filter = filter;
    setSearchParams(next);
  };

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    const next = {};
    if (selectedTeamId && selectedTeamId !== 'ALL') next.teamId = selectedTeamId;
    if (nextFilter && nextFilter !== 'upcoming') next.filter = nextFilter;
    setSearchParams(next);
  };

  const createHref = selectedTeamId !== 'ALL'
    ? `${basePath}/meetings/create?teamId=${selectedTeamId}`
    : `${basePath}/meetings/create`;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Video}
        title="Meetings"
        description="Team meetings with an agenda and an external Zoom, Meet, or Teams link."
        actions={
          canCreate ? (
            <button type="button" onClick={() => navigate(createHref)} className="btn-primary">
              <CalendarPlus className="w-4 h-4" strokeWidth={2} />
              Schedule meeting
            </button>
          ) : null
        }
      />

      <div className="surface p-4 space-y-4">
        <div>
          <label className="label" htmlFor="meeting-team">Team</label>
          <select
            id="meeting-team"
            value={selectedTeamId}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="field"
          >
            <option value="ALL">All my teams</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.name}{team.projectTitle ? ` (${team.projectTitle})` : ''}
              </option>
            ))}
          </select>
        </div>
        <FilterChips
          value={filter}
          onChange={handleFilterChange}
          options={FILTERS}
        />
      </div>

      {canCreate && selectedTeamId !== 'ALL' && !isLeaderOfSelected && selectedTeam && (
        <p className="text-sm text-gray-500">
          Only the leader of {selectedTeam.name} can schedule or edit meetings for that team.
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No meetings"
          description={
            filter === 'upcoming'
              ? 'No upcoming meetings for the selected team.'
              : 'No meetings match this filter.'
          }
          actionText={canCreate ? 'Schedule meeting' : undefined}
          actionLink={canCreate ? createHref : undefined}
        />
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <button
              key={meeting.meetingId}
              type="button"
              onClick={() => navigate(`${basePath}/meetings/${meeting.meetingId}`)}
              className="w-full text-left surface p-4 sm:p-5 hover:border-indigo-200 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{meeting.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {meeting.teamName} · {meeting.projectTitle}
                  </p>
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
                  {meeting.myRsvp && (
                    <span className="text-xs text-gray-500">You: {meeting.myRsvp.replace('_', ' ').toLowerCase()}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;
