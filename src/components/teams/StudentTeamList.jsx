import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import toast from 'react-hot-toast';

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
        title="My teams"
        description="Teams you are a member of."
      />

      {teams.length === 0 ? (
        <EmptyState
          title="No teams yet"
          description="You haven't been added to any team yet. Check your invitations or wait for a team assignment."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <article key={team.teamId} className="surface p-5 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.projectTitle}</p>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-full">
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

              <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Link
                  to={`${basePath}/teams/${team.teamId}`}
                  className="btn-primary flex-1"
                >
                  View team
                </Link>
                <Link
                  to={`${basePath}/milestones?teamId=${team.teamId}`}
                  className="btn-secondary"
                >
                  Milestones
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTeamList;
