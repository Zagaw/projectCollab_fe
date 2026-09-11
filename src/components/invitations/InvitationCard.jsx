import React from 'react';

const InvitationCard = ({ invitation, onAccept, onReject }) => {
  return (
    <article className="surface p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{invitation.teamName}</h3>
          <p className="text-sm text-gray-600">{invitation.projectTitle}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 shrink-0">
          Pending
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600 mb-4 flex-1">
        <p>
          <span className="font-medium text-ink">Invited by:</span> {invitation.inviterName}
        </p>
        <p>
          <span className="font-medium text-ink">Invited on:</span>{' '}
          {new Date(invitation.invitedAt).toLocaleDateString()}
        </p>
        {invitation.message && (
          <p className="text-gray-500 pt-1">{invitation.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100 mt-auto">
        <button
          type="button"
          onClick={() => onAccept(invitation.invitationId)}
          className="btn-primary flex-1"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => onReject(invitation.invitationId)}
          className="btn-danger flex-1"
        >
          Decline
        </button>
      </div>
    </article>
  );
};

export default InvitationCard;
