import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/student';

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const response = await teamApi.getMyTeams();
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to load your teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
        <p className="text-gray-600">Teams you are a member of</p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Yet</h3>
          <p className="text-gray-500">You haven't been added to any team yet.</p>
          <p className="text-sm text-gray-400 mt-1">Check your invitations or wait for a team assignment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.teamId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.projectTitle}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {team.totalMembers || 0} members
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {team.description || 'No description'}
              </p>
              
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span>👤 Leader: {team.teamLeader?.fullName || 'Not assigned'}</span>
                <span>•</span>
                <span>✅ {team.activeMembers || 0} active</span>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`${basePath}/teams/${team.teamId}`}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  View Team
                </Link>
                <Link
                  to={`${basePath}/milestones?teamId=${team.teamId}`}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition text-center"
                >
                  🎯 Milestones
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTeamList;