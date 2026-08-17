import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';

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
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Yet</h3>
        <p className="text-gray-500 mb-4">Create teams to organize your project members</p>
        <Link
          to={`/lecturer/teams/create?projectId=${projectId}`}
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create First Team
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <div key={team.teamId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <Link to={`/lecturer/teams/${team.teamId}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
                {team.name}
              </h3>
            </Link>
            <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
              {team.totalMembers || 0} members
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {team.description || 'No description'}
          </p>
          
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span>👤 Leader: {team.teamLeader?.fullName || 'Not assigned'}</span>
            <span>•</span>
            <span>✅ {team.activeMembers || 0} active</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/lecturer/teams/${team.teamId}`}
              state={{ projectId: projectId || team.projectId }}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition text-center"
            >
              View Team
            </Link>
            <button
              onClick={() => handleDelete(team.teamId)}
              disabled={deleteLoading === team.teamId}
              className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition disabled:opacity-50"
            >
              {deleteLoading === team.teamId ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamList;