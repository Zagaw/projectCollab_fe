import React, { useState } from 'react';
import StudentSearchList from '../common/StudentSearchList';
import toast from 'react-hot-toast';
import invitationApi from '../../api/invitationApi';
import { UserPlus } from 'lucide-react';

const InviteMember = ({ teamId, onClose, onInvite }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error('Please select a student to invite');
      return;
    }

    setLoading(true);
    try {
      await invitationApi.inviteStudent({
        teamId: parseInt(teamId),
        userId: selectedUser.userId
      });
      toast.success(`Invitation sent to ${selectedUser.firstName} ${selectedUser.lastName}!`);
      onInvite();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="surface max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-ink">Invite member</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Search and select a student to invite to this team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-50 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <StudentSearchList
            selectedUserId={selectedUser?.userId}
            onSelect={handleSelect}
            onClose={onClose}
          />

          {selectedUser && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-ink">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <span className="ml-auto text-xs text-indigo-700 font-medium">
                  Selected
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {selectedUser ? 'Ready to invite' : 'Select a student to invite'}
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedUser || loading}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4" strokeWidth={2} />
              {loading ? 'Sending...' : `Invite ${selectedUser ? selectedUser.firstName : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMember;
