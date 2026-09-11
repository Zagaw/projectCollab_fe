import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import TeamProgressPanel from './TeamProgressPanel';
import { PageHeader } from '../common/PageHeader';
import { reportBasePath } from '../reports/reportUtils';
import toast from 'react-hot-toast';

const ProgressPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(searchParams.get('teamId') || '');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await progressApi.getMyProgress();
      const data = response.data || [];
      setTeams(data);
      setSelectedTeamId((current) => {
        if (current && data.some((team) => String(team.teamId) === String(current))) {
          return String(current);
        }
        return data[0] ? String(data[0].teamId) : '';
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load progress');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const selected = teams.find((team) => String(team.teamId) === String(selectedTeamId));

  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId);
    if (teamId) {
      setSearchParams({ teamId });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <LoadingSpinner text="Loading progress..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress"
        description="Team completion is based on tasks. Member ranking uses tasks completed; comments, files, and discussions are shown beside that score."
      />

      {teams.length === 0 ? (
        <EmptyState
          title="No team progress yet"
          description="Join a team to see task and milestone progress, plus how members are contributing."
        />
      ) : (
        <>
          <div className="surface p-4">
            <label className="label" htmlFor="progress-team">Team</label>
            <select
              id="progress-team"
              value={selectedTeamId}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="field max-w-md"
            >
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}{team.projectTitle ? ` (${team.projectTitle})` : ''} — {team.taskPercent}%
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="surface p-5 sm:p-6">
              <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{selected.teamName}</h2>
                  <p className="text-sm text-gray-500">{selected.projectTitle}</p>
                </div>
                <Link
                  to={`${reportBasePath()}/reports?teamId=${selected.teamId}&type=PROGRESS`}
                  className="text-sm text-indigo-700 hover:text-indigo-800"
                >
                  Open in Reports
                </Link>
              </div>
              <TeamProgressPanel progress={selected} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressPage;
