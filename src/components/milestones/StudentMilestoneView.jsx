import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import teamApi from '../../api/teamApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentMilestoneView = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const navigate = useNavigate();
  
  const [milestones, setMilestones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(teamId || '');
  const [loading, setLoading] = useState(true);
  const [isTeamLeader, setIsTeamLeader] = useState(false);

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/teamleader';

  useEffect(() => {
    fetchMyTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      fetchMilestones();
      checkIfTeamLeader();
    }
  }, [selectedTeamId]);

  const fetchMyTeams = async () => {
    try {
      const response = await teamApi.getMyTeams();
      setTeams(response.data);
      if (!selectedTeamId && response.data.length > 0) {
        setSelectedTeamId(response.data[0].teamId);
      }
    } catch (error) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    if (!selectedTeamId) return;
    try {
      setLoading(true);
      const response = await milestoneApi.getMilestonesByTeam(selectedTeamId);
      setMilestones(response.data);
    } catch (error) {
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const checkIfTeamLeader = async () => {
    try {
      const response = await teamApi.getTeamById(selectedTeamId);
      const team = response.data;
      setIsTeamLeader(team.teamLeader?.userId === user?.userId);
    } catch (error) {
      setIsTeamLeader(false);
    }
  };

  const handleComplete = async (milestoneId) => {
    if (!isTeamLeader) {
      toast.error('Only team leaders can mark milestones as complete');
      return;
    }
    try {
      await milestoneApi.updateMilestoneStatus(milestoneId, true);
      toast.success('Milestone marked as completed!');
      fetchMilestones();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update milestone');
    }
  };

  const handleDelete = async (milestoneId) => {
    if (!isTeamLeader) {
      toast.error('Only team leaders can delete milestones');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await milestoneApi.deleteMilestone(milestoneId);
      toast.success('Milestone deleted successfully');
      fetchMilestones();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete milestone');
    }
  };

  // ✅ FIX: View details - always available for all members
  const handleViewDetails = (milestoneId) => {
    navigate(`${basePath}/milestones/${milestoneId}`);
  };

  // Create milestone - only for team leaders
  const handleCreateMilestone = () => {
    navigate(`${basePath}/milestones/create?teamId=${selectedTeamId}`);
  };

  if (loading) return <LoadingSpinner />;

  const selectedTeam = teams.find(t => t.teamId === parseInt(selectedTeamId));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Milestones</h1>
          <p className="text-gray-600">Track progress and achievements</p>
        </div>
        {isTeamLeader && (
          <button
            onClick={handleCreateMilestone}
            className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span>➕</span> Create Milestone
          </button>
        )}
      </div>

      {/* Team Selector */}
      {teams.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Team</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.name} - {team.projectTitle}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTeam && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Team:</span> {selectedTeam.name}
            {isTeamLeader && (
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                You are the Team Leader
              </span>
            )}
          </p>
        </div>
      )}

      {milestones.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones Yet</h3>
          <p className="text-gray-500">This team hasn't created any milestones yet.</p>
          {isTeamLeader && (
            <button
              onClick={handleCreateMilestone}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Create First Milestone
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.milestoneId}
              milestone={milestone}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              // ✅ FIX: Show actions only for team leaders, BUT view details is always available
              showActions={isTeamLeader}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMilestoneView;