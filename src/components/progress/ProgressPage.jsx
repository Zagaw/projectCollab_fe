import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import TeamProgressPanel from './TeamProgressPanel';
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-600 mt-1">
          Team completion is based on tasks. Member ranking uses tasks completed; comments, files, and discussions are shown beside that score.
        </p>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          title="No team progress yet"
          description="Join a team to see task and milestone progress, plus how members are contributing."
          icon="📈"
        />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}{team.projectTitle ? ` (${team.projectTitle})` : ''} — {team.taskPercent}%
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">{selected.teamName}</h2>
                <p className="text-sm text-gray-500">{selected.projectTitle}</p>
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
