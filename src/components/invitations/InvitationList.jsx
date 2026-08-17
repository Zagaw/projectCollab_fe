import React, { useState, useEffect } from 'react';
import invitationApi from '../../api/invitationApi';
import InvitationCard from './InvitationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const InvitationList = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await invitationApi.getMyInvitations();
      setInvitations(response.data);
    } catch (error) {
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await invitationApi.acceptInvitation(invitationId);
      toast.success('Invitation accepted! You are now a member of the team.');
      setInvitations(invitations.filter(inv => inv.invitationId !== invitationId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept invitation');
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await invitationApi.rejectInvitation(invitationId);
      toast.success('Invitation rejected');
      setInvitations(invitations.filter(inv => inv.invitationId !== invitationId));
    } catch (error) {
      toast.error('Failed to reject invitation');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Invitations</h1>
        <p className="text-gray-600">Review and respond to team invitations</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : invitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Invitations</h3>
          <p className="text-gray-500">You don't have any pending team invitations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation.invitationId}
              invitation={invitation}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationList;