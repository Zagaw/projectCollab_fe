import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import invitationApi from '../../api/invitationApi';
import InviteMember from './InviteMember';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

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

  if (loading) return <LoadingSpinner />;
  if (!team) return <div>Team not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(`/lecturer/projects/${team.projectId}`)}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
            >
            ← Back to Project: {team.projectTitle}
            </button>
          <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
          <p className="text-gray-600">
            Project: {team.projectTitle} • {team.totalMembers || 0} members
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Invite Member
        </button>
      </div>

      {/* Team Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600">{team.description || 'No description provided'}</p>
          
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Team Leader:</span>
              <span className="ml-2 font-medium">
                {team.teamLeader?.fullName || 'Not assigned'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2">
                {new Date(team.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Members</span>
              <span className="font-medium">{team.totalMembers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Members</span>
              <span className="font-medium text-green-600">{team.activeMembers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Invites</span>
              <span className="font-medium text-yellow-600">{team.pendingMembers || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
        
        {team.members && team.members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.members.map((member) => (
                  <tr key={member.teamMemberId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {member.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.fullName}</p>
                          {team.teamLeader?.userId === member.userId && (
                            <span className="text-xs text-indigo-600 font-medium">Team Leader</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{member.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        member.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {member.status === 'ACTIVE' && team.teamLeader?.userId !== member.userId && (
                          <>
                            <button
                              onClick={() => handleAssignLeader(member.userId)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg hover:bg-indigo-200 transition"
                            >
                              Make Leader
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member.teamMemberId)}
                              className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                            >
                              Remove
                            </button>
                          </>
                        )}
                        {member.status === 'PENDING' && (
                          <button
                            onClick={() => handleRemoveMember(member.teamMemberId)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                          >
                            Cancel Invite
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
          <div className="text-center py-8">
            <p className="text-gray-500">No members yet. Invite students to join this team.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
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