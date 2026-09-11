import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';
import EmptyState from '../common/EmptyState';
import { Users } from 'lucide-react';

const TeamList = ({ teams, projectId, onTeamUpdate }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDelete = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    
    setDeleteLoading(teamId);
    try {
      await teamApi.deleteTeam(teamId);
      toast.success('Team deleted successfully');
      if (onTeamUpdate) onTeamUpdate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete team');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No teams yet"
        description="Create teams to organize your project members."
        actionText="Create first team"
        actionLink={`/lecturer/teams/create?projectId=${projectId}`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <article key={team.teamId} className="surface p-5 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-3">
            <Link to={`/lecturer/teams/${team.teamId}`}>
              <h3 className="text-lg font-semibold text-ink hover:text-indigo-700 transition">
                {team.name}
              </h3>
            </Link>
            <span className="px-2 py-1 bg-gray-50 rounded-md text-xs text-gray-600">
              {team.totalMembers || 0} members
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 flex-1">
            {team.description || 'No description yet.'}
          </p>
          
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
            <span>Leader: {team.teamLeader?.fullName || 'Not assigned'}</span>
            <span>{team.activeMembers || 0} active</span>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
            <Link
              to={`/lecturer/teams/${team.teamId}`}
              state={{ projectId: projectId || team.projectId }}
              className="btn-primary flex-1"
            >
              View team
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(team.teamId)}
              disabled={deleteLoading === team.teamId}
              className="btn-danger"
            >
              {deleteLoading === team.teamId ? '...' : 'Delete'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default TeamList;
