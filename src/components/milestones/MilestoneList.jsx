import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

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
      
      // Get all projects created by lecturer
      const projectsRes = await projectApi.getMyProjects();
      const projects = projectsRes.data || [];
      
      if (projects.length === 0) {
        setMilestones([]);
        setLoading(false);
        return;
      }
      
      // For each project, get teams and their milestones
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

  const filteredMilestones = milestones.filter(m => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return m.isCompleted;
    if (filter === 'IN_PROGRESS') return !m.isCompleted;
    if (filter === 'OVERDUE') {
      return !m.isCompleted && new Date(m.deadline) < new Date();
    }
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Milestones</h1>
          <p className="text-gray-600">
            {milestones.length} milestone(s) across all your projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'IN_PROGRESS'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'COMPLETED'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('OVERDUE')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'OVERDUE'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Overdue
        </button>
      </div>

      {/* Milestones Grid */}
      {filteredMilestones.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-3">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones Found</h3>
          <p className="text-gray-500">
            {milestones.length === 0 
              ? 'No milestones have been created in your projects yet.'
              : 'No milestones match the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.milestoneId}
              milestone={milestone}
              onComplete={handleComplete}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneList;