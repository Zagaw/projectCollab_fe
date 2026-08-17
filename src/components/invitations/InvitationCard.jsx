import React from 'react';

const InvitationCard = ({ invitation, onAccept, onReject }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{invitation.teamName}</h3>
          <p className="text-sm text-gray-600">{invitation.projectTitle}</p>
        </div>
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          PENDING
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-medium">Invited by:</span> {invitation.inviterName}
        </p>
        <p>
          <span className="font-medium">Invited on:</span>{' '}
          {new Date(invitation.invitedAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 italic">{invitation.message}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onAccept(invitation.invitationId)}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(invitation.invitationId)}
          className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default InvitationCard;