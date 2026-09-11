import React, { useState, useEffect } from 'react';
import invitationApi from '../../api/invitationApi';
import InvitationCard from './InvitationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

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
    <div className="space-y-5">
      <PageHeader
        icon={Mail}
        title="Invitations"
        description="Review and respond to team invitations."
      />

      {loading ? (
        <LoadingSpinner />
      ) : invitations.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No pending invitations"
          description="You don't have any pending team invitations."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
