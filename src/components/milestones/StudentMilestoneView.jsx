import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import teamApi from '../../api/teamApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, StatCard, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const isOverdue = (m) => !m.isCompleted && m.deadline && new Date(m.deadline) < new Date();

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
  const [filter, setFilter] = useState('ALL');

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

  const handleViewDetails = (milestoneId) => {
    navigate(`${basePath}/milestones/${milestoneId}`);
  };

  const handleCreateMilestone = () => {
    navigate(`${basePath}/milestones/create?teamId=${selectedTeamId}`);
  };

  if (loading) return <LoadingSpinner />;

  const selectedTeam = teams.find(t => t.teamId === parseInt(selectedTeamId));

  const counts = {
    ALL: milestones.length,
    IN_PROGRESS: milestones.filter((m) => !m.isCompleted).length,
    COMPLETED: milestones.filter((m) => m.isCompleted).length,
    OVERDUE: milestones.filter(isOverdue).length,
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return m.isCompleted;
    if (filter === 'IN_PROGRESS') return !m.isCompleted;
    if (filter === 'OVERDUE') return isOverdue(m);
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Milestones"
        description="Track progress and due dates for your team."
        actions={
          isTeamLeader ? (
            <button type="button" onClick={handleCreateMilestone} className="btn-primary">
              Create milestone
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Milestones" value={counts.ALL} />
        <StatCard label="In progress" value={counts.IN_PROGRESS} />
        <StatCard label="Completed" value={counts.COMPLETED} />
        <StatCard label="Overdue" value={counts.OVERDUE} warn={counts.OVERDUE > 0} />
      </div>

      <div className="surface p-4 space-y-4">
        {teams.length > 1 && (
          <div>
            <label className="label" htmlFor="milestone-team-select">Team</label>
            <select
              id="milestone-team-select"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="field"
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
          <p className="text-sm text-gray-600">
            {selectedTeam.name}
            {isTeamLeader ? ' · You lead this team' : ''}
          </p>
        )}
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'ALL', label: 'All', count: counts.ALL },
            { id: 'IN_PROGRESS', label: 'In progress', count: counts.IN_PROGRESS },
            { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
            { id: 'OVERDUE', label: 'Overdue', count: counts.OVERDUE },
          ]}
        />
      </div>

      {filteredMilestones.length === 0 ? (
        <EmptyState
          title="No milestones yet"
          description={
            milestones.length === 0
              ? "This team hasn't created any milestones yet."
              : 'No milestones match the selected filter.'
          }
          actionText={isTeamLeader && milestones.length === 0 ? 'Create milestone' : undefined}
          onAction={isTeamLeader && milestones.length === 0 ? handleCreateMilestone : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.milestoneId}
              milestone={milestone}
              onComplete={handleComplete}
              onDelete={handleDelete}
              detailsTo={`${basePath}/milestones/${milestone.milestoneId}`}
              onViewDetails={handleViewDetails}
              showActions={isTeamLeader}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMilestoneView;
