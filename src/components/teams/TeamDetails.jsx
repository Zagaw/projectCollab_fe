import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import invitationApi from '../../api/invitationApi';
import InviteMember from './InviteMember';
import TeamProgressSection from '../progress/TeamProgressSection';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Users, UserPlus, Mail } from 'lucide-react';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // FIX: Determine base path from current route
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/lecturer';

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await teamApi.getTeamById(teamId);
      setTeam(response.data);
    } catch (error) {
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLeader = async (userId) => {
    try {
      await teamApi.assignTeamLeader(teamId, userId);
      toast.success('Team leader assigned successfully');
      fetchTeamDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign team leader');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await invitationApi.removeMember(teamId, memberId);
      toast.success('Member removed successfully');
      fetchTeamDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove member');
    }
  };

  // FIX: Handle back navigation based on current route
  const handleBack = () => {
    if (isLecturerRoute) {
      navigate(`/lecturer/projects/${team?.projectId}`);
    } else if (isTeamLeaderRoute) {
      navigate('/teamleader/teams');
    } else if (isStudentRoute) {
      navigate('/student/teams');
    } else {
      navigate(-1);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!team) {
    return (
      <EmptyState
        icon={Users}
        title="Team not found"
        description="It may have been deleted, or you do not have access."
        actionText="Go back"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-indigo-700 hover:text-indigo-800 mb-2"
          >
            Back
          </button>
          <h1 className="page-title">{team.name}</h1>
          <p className="page-kicker">
            {team.projectTitle} · {team.totalMembers || 0} members
          </p>
        </div>
        {(isLecturerRoute || isTeamLeaderRoute) && (
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2} />
            Invite member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 surface p-5 sm:p-6">
          <h3 className="font-semibold text-ink mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{team.description || 'No description yet.'}</p>
          
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Team leader</dt>
              <dd className="font-medium text-ink">{team.teamLeader?.fullName || 'Not assigned'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium text-ink">
                {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <StatCard icon={Users} label="Total members" value={team.totalMembers || 0} />
          <StatCard icon={Users} tone="sky" label="Active members" value={team.activeMembers || 0} />
          <StatCard icon={Mail} label="Pending invites" value={team.pendingMembers || 0} warn={(team.pendingMembers || 0) > 0} />
        </div>
      </div>

      <div className="surface p-5 sm:p-6">
        <h3 className="font-semibold text-ink mb-4">Team members</h3>
        
        {team.members && team.members.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>Member</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.members.map((member) => (
                  <tr key={member.teamMemberId} className="border-b border-gray-100">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-indigo-700 font-semibold text-sm">
                            {member.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-ink">{member.fullName}</p>
                          {team.teamLeader?.userId === member.userId && (
                            <span className="text-xs text-indigo-700 font-medium">Team leader</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600">{member.email}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'ACTIVE' ? 'bg-green-50 text-green-800' :
                        member.status === 'PENDING' ? 'bg-amber-50 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status === 'ACTIVE' ? 'Active' : member.status === 'PENDING' ? 'Pending' : member.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {(isLecturerRoute || isTeamLeaderRoute) && member.status === 'ACTIVE' && team.teamLeader?.userId !== member.userId && (
                          <>
                            {isLecturerRoute && (
                              <button
                                type="button"
                                onClick={() => handleAssignLeader(member.userId)}
                                className="btn-secondary px-3 py-1.5 text-xs"
                              >
                                Make leader
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.teamMemberId)}
                              className="btn-danger px-3 py-1.5 text-xs"
                            >
                              Remove
                            </button>
                          </>
                        )}
                        {(isLecturerRoute || isTeamLeaderRoute) && member.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.teamMemberId)}
                            className="btn-danger px-3 py-1.5 text-xs"
                          >
                            Cancel invite
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No members yet. Invite students to join this team.</p>
        )}
      </div>

      <TeamProgressSection teamId={teamId} />

      {showInviteModal && (
        <InviteMember
          teamId={teamId}
          onClose={() => setShowInviteModal(false)}
          onInvite={fetchTeamDetails}
        />
      )}
    </div>
  );
};

export default TeamDetails;
