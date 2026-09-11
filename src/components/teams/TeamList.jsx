import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';
import EmptyState from '../common/EmptyState';
import { IconWell } from '../common/PageHeader';
import { Users, FolderKanban, UserRound, CircleCheck, ArrowRight } from 'lucide-react';

const ACCENTS = [
  { bar: 'bg-indigo-600', well: 'teal' },
  { bar: 'bg-sky-600', well: 'sky' },
  { bar: 'bg-sand', well: 'sand' },
];

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
      {teams.map((team) => {
        const accent = ACCENTS[Math.abs(Number(team.teamId) || 0) % ACCENTS.length];
        return (
          <article key={team.teamId} className="surface p-5 flex flex-col overflow-hidden hover:border-indigo-200 transition">
            <div className={`h-1.5 -mx-5 -mt-5 mb-4 ${accent.bar}`} />
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <IconWell tone={accent.well}>
                  <Users className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                </IconWell>
                <div className="min-w-0">
                  <Link to={`/lecturer/teams/${team.teamId}`}>
                    <h3 className="text-lg font-semibold text-ink hover:text-indigo-700 transition">
                      {team.name}
                    </h3>
                  </Link>
                  {team.projectTitle && (
                    <p className="flex items-center gap-1.5 text-sm text-sky-800 mt-0.5">
                      <FolderKanban className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                      {team.projectTitle}
                    </p>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-full shrink-0">
                {team.totalMembers || 0} members
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 flex-1">
              {team.description || 'No description yet.'}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="w-3.5 h-3.5 text-sand-700" strokeWidth={1.75} aria-hidden />
                Leader: {team.teamLeader?.fullName || 'Not assigned'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 text-indigo-700" strokeWidth={1.75} aria-hidden />
                {team.activeMembers || 0} active
              </span>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
              <Link
                to={`/lecturer/teams/${team.teamId}`}
                state={{ projectId: projectId || team.projectId }}
                className="btn-primary flex-1"
              >
                View team
                <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden />
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
        );
      })}
    </div>
  );
};

export default TeamList;
