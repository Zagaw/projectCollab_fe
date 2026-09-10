import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import teamApi from '../../api/teamApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">
            Team meetings with an agenda and an external Zoom, Meet, or Teams link.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => navigate(createHref)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Schedule meeting
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-3">
        <select
          value={selectedTeamId}
          onChange={(e) => handleTeamChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
        >
          <option value="ALL">All my teams</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.name}{team.projectTitle ? ` (${team.projectTitle})` : ''}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilterChange(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
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
          title="No meetings"
          description={
            filter === 'upcoming'
              ? 'No upcoming meetings for the selected team.'
              : 'No meetings match this filter.'
          }
          actionText={canCreate ? 'Schedule meeting' : undefined}
          actionLink={canCreate ? createHref : undefined}
          icon="📅"
        />
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <button
              key={meeting.meetingId}
              type="button"
              onClick={() => navigate(`${basePath}/meetings/${meeting.meetingId}`)}
              className="w-full text-left bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{meeting.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {meeting.teamName} • {meeting.projectTitle}
                  </p>
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
