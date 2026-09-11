import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, IconWell } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Users, FolderKanban, UserRound, CircleCheck, Flag, ArrowRight } from 'lucide-react';

const ACCENTS = [
  { bar: 'bg-indigo-600', well: 'teal' },
  { bar: 'bg-sky-600', well: 'sky' },
  { bar: 'bg-sand', well: 'sand' },
];

const StudentTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/student';

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const response = await teamApi.getMyTeams();
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to load your teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Users}
        title="My teams"
        description="Teams you are a member of."
      />

      {teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams yet"
          description="You haven't been added to any team yet. Check your invitations or wait for a team assignment."
        />
      ) : (
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
                    <h3 className="text-lg font-semibold text-ink">{team.name}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-sky-800 mt-0.5">
                      <FolderKanban className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                      {team.projectTitle}
                    </p>
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

              <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Link
                  to={`${basePath}/teams/${team.teamId}`}
                  className="btn-primary flex-1"
                >
                  View team
                  <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden />
                </Link>
                <Link
                  to={`${basePath}/milestones?teamId=${team.teamId}`}
                  className="btn-secondary"
                >
                  <Flag className="w-4 h-4" strokeWidth={2} aria-hidden />
                  Milestones
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTeamList;
