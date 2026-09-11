import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, StatCard, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Flag, Timer, CircleCheck, AlertTriangle } from 'lucide-react';

const isOverdue = (m) => !m.isCompleted && m.deadline && new Date(m.deadline) < new Date();

const MilestoneList = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMilestones();
  }, []);

  const fetchAllMilestones = async () => {
    try {
      setLoading(true);

      const projectsRes = await projectApi.getMyProjects();
      const projects = projectsRes.data || [];

      if (projects.length === 0) {
        setMilestones([]);
        setLoading(false);
        return;
      }

      let allMilestones = [];
      for (const project of projects) {
        try {
          const teamsRes = await teamApi.getTeamsByProject(project.projectId);
          const teams = teamsRes.data || [];

          for (const team of teams) {
            try {
              const milestonesRes = await milestoneApi.getMilestonesByTeam(team.teamId);
              const teamMilestones = milestonesRes.data || [];
              allMilestones = [...allMilestones, ...teamMilestones];
            } catch (e) {
              // Skip teams without milestones
            }
          }
        } catch (e) {
          // Skip projects without teams
        }
      }

      setMilestones(allMilestones);
    } catch (error) {
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (milestoneId) => {
    try {
      await milestoneApi.updateMilestoneStatus(milestoneId, true);
      toast.success('Milestone marked as completed!');
      fetchAllMilestones();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update milestone');
    }
  };

  const handleDelete = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await milestoneApi.deleteMilestone(milestoneId);
      toast.success('Milestone deleted successfully');
      fetchAllMilestones();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete milestone');
    }
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return m.isCompleted;
    if (filter === 'IN_PROGRESS') return !m.isCompleted;
    if (filter === 'OVERDUE') return isOverdue(m);
    return true;
  });

  const counts = {
    ALL: milestones.length,
    IN_PROGRESS: milestones.filter((m) => !m.isCompleted).length,
    COMPLETED: milestones.filter((m) => m.isCompleted).length,
    OVERDUE: milestones.filter(isOverdue).length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Flag}
        title="Milestones"
        description={`${milestones.length} across your projects`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flag} label="Milestones" value={counts.ALL} />
        <StatCard icon={Timer} tone="sky" label="In progress" value={counts.IN_PROGRESS} />
        <StatCard icon={CircleCheck} tone="sand" label="Completed" value={counts.COMPLETED} />
        <StatCard icon={AlertTriangle} label="Overdue" value={counts.OVERDUE} warn={counts.OVERDUE > 0} />
      </div>

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

      {filteredMilestones.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No milestones found"
          description={
            milestones.length === 0
              ? 'No milestones have been created in your projects yet.'
              : 'No milestones match the selected filter.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.milestoneId}
              milestone={milestone}
              onComplete={handleComplete}
              onDelete={handleDelete}
              detailsTo={`/lecturer/milestones/${milestone.milestoneId}`}
              onViewDetails={(id) => navigate(`/lecturer/milestones/${id}`)}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneList;
