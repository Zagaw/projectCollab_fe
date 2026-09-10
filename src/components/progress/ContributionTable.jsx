import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ContributionTable = ({ members = [], compact = false }) => {
  const { user } = useAuth();
  const rows = members || [];

  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">No active members to show yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="py-2 pr-3">Member</th>
            <th className="py-2 px-2">Assigned</th>
            <th className="py-2 px-2">Completed</th>
            <th className="py-2 px-2">Overdue</th>
            {!compact && (
              <>
                <th className="py-2 px-2">Comments</th>
                <th className="py-2 px-2">Files</th>
                <th className="py-2 px-2">Discussions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((member) => {
            const isMe = String(member.userId) === String(user?.userId);
            return (
              <tr
                key={member.userId}
                className={`border-b border-gray-100 ${isMe ? 'bg-indigo-50/70' : 'hover:bg-gray-50'}`}
              >
                <td className="py-3 pr-3">
                  <p className="font-medium text-gray-900">
                    {member.name}
                    {isMe && <span className="ml-2 text-xs font-medium text-indigo-600">You</span>}
                  </p>
                </td>
                <td className="py-3 px-2 text-sm text-gray-700">{member.assigned}</td>
                <td className="py-3 px-2 text-sm font-semibold text-gray-900">{member.completed}</td>
                <td className={`py-3 px-2 text-sm ${member.overdue > 0 ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                  {member.overdue}
                </td>
                {!compact && (
                  <>
                    <td className="py-3 px-2 text-sm text-gray-700">{member.comments}</td>
                    <td className="py-3 px-2 text-sm text-gray-700">{member.files}</td>
                    <td className="py-3 px-2 text-sm text-gray-700">{member.discussions}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3">
        Ranked by tasks completed. Comments, files, and discussions are shown for context and are not part of the score.
      </p>
    </div>
  );
};

export default ContributionTable;
