import React, { useState } from 'react';
import StudentSearchList from '../common/StudentSearchList';
import toast from 'react-hot-toast';
import invitationApi from '../../api/invitationApi';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Invite Member</h3>
            <p className="text-sm text-gray-500">
              Search and select a student to invite to this team
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Student Search */}
        <div className="flex-1 overflow-y-auto p-4">
          <StudentSearchList
            selectedUserId={selectedUser?.userId}
            onSelect={handleSelect}
            onClose={onClose}
          />

          {/* Selected Student Preview */}
          {selectedUser && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <span className="ml-auto text-xs text-green-600 font-medium">
                  ✅ Selected
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {selectedUser ? 'Ready to invite' : 'Select a student to invite'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedUser || loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                `Invite ${selectedUser ? selectedUser.firstName : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMember;