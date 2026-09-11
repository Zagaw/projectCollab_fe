import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ContributionTable = ({ members = [], compact = false }) => {
  const { user } = useAuth();
  const rows = members || [];

  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">No active members to show yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Assigned</th>
            <th>Completed</th>
            <th>Overdue</th>
            {!compact && (
              <>
                <th>Comments</th>
                <th>Files</th>
                <th>Discussions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((member, index) => {
            const isMe = String(member.userId) === String(user?.userId);
            return (
              <tr
                key={member.userId}
                className={isMe ? 'bg-indigo-50/70' : index % 2 === 1 ? 'bg-gray-50' : ''}
              >
                <td>
                  <p className="font-medium">
                    {member.name}
                    {isMe && <span className="ml-2 text-xs font-medium text-indigo-700">You</span>}
                  </p>
                </td>
                <td>{member.assigned}</td>
                <td className="font-semibold">{member.completed}</td>
                <td className={member.overdue > 0 ? 'text-red-700 font-medium' : ''}>
                  {member.overdue}
                </td>
                {!compact && (
                  <>
                    <td>{member.comments}</td>
                    <td>{member.files}</td>
                    <td>{member.discussions}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3 px-3 sm:px-0">
        Ranked by tasks completed. Comments, files, and discussions are shown for context and are not part of the score.
      </p>
    </div>
  );
};

export default ContributionTable;
