import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import taskApi from '../../api/taskApi';
import TaskList from '../tasks/TaskList';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const MilestoneDetails = () => {
  const { milestoneId } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLecturerRoute = window.location.pathname.includes('/lecturer');
  const isTeamLeaderRoute = window.location.pathname.includes('/teamleader');
  const isStudentRoute = window.location.pathname.includes('/student');
  const basePath = isLecturerRoute ? '/lecturer' : isTeamLeaderRoute ? '/teamleader' : '/student';
  const canCreateTask = isLecturerRoute || isTeamLeaderRoute;
  const canManage = isTeamLeaderRoute;

  useEffect(() => {
    fetchMilestoneDetails();
  }, [milestoneId]);

  const fetchMilestoneDetails = async () => {
    try {
      setLoading(true);
      const [milestoneRes, tasksRes] = await Promise.all([
        milestoneApi.getMilestoneById(milestoneId),
        taskApi.getTasksByMilestone(milestoneId)
      ]);
      setMilestone(milestoneRes.data);
      setTasks(tasksRes.data || []);
    } catch (error) {
      toast.error('Failed to load milestone details');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await milestoneApi.updateMilestoneStatus(milestoneId, true);
      toast.success('Milestone marked as completed!');
      fetchMilestoneDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update milestone');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await milestoneApi.deleteMilestone(milestoneId);
      toast.success('Milestone deleted successfully');
      navigate(`${basePath}/milestones`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete milestone');
    }
  };

  const handleBack = () => {
    navigate(`${basePath}/milestones`);
  };

  const handleCreateTask = () => {
    navigate(`${basePath}/tasks/create?milestoneId=${milestoneId}&teamId=${milestone.teamId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!milestone) {
    return (
      <EmptyState
        title="Milestone not found"
        description="It may have been deleted, or you do not have access."
        actionText="Back to milestones"
        actionLink={`${basePath}/milestones`}
      />
    );
  }

  const isOverdue = milestone.deadline &&
    new Date(milestone.deadline) < new Date() &&
    !milestone.isCompleted;

  const statusLabel = milestone.isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'In progress';
  const statusClass = milestone.isCompleted
    ? 'bg-green-50 text-green-800'
    : isOverdue
      ? 'bg-red-50 text-red-700'
      : 'bg-amber-50 text-amber-800';

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button type="button" onClick={handleBack} className="text-sm text-indigo-700 hover:text-indigo-800 mb-2">
            Back to milestones
          </button>
          <h1 className="page-title">{milestone.title}</h1>
          <p className="page-kicker">
            {milestone.projectTitle}
            {milestone.teamName ? ` · ${milestone.teamName}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusLabel}
          </span>
          {canCreateTask && (
            <button type="button" onClick={handleCreateTask} className="btn-primary">
              Create task
            </button>
          )}
          {canManage && !milestone.isCompleted && (
            <button type="button" onClick={handleComplete} className="btn-secondary">
              Mark complete
            </button>
          )}
          {canManage && (
            <button type="button" onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 surface p-5 sm:p-6">
          <h3 className="font-semibold text-ink mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{milestone.description || 'No description yet.'}</p>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Team</dt>
              <dd className="font-medium">{milestone.teamName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Created by</dt>
              <dd className="font-medium">{milestone.createdByName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium">{new Date(milestone.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <aside className="surface p-5 sm:p-6">
          <h3 className="font-semibold text-ink mb-3">Dates and status</h3>
          <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-ink'}`}>
            Deadline: {milestone.deadline ? new Date(milestone.deadline).toLocaleDateString() : 'None'}
            {isOverdue ? ' (overdue)' : ''}
          </p>
          {milestone.completedAt && (
            <p className="text-sm text-gray-600 mt-2">
              Completed {new Date(milestone.completedAt).toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">{tasks.length} tasks</p>
        </aside>
      </div>

      <div className="surface p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-ink">Tasks for this milestone</h3>
          {canCreateTask && (
            <button type="button" onClick={handleCreateTask} className="btn-secondary">
              Add task
            </button>
          )}
        </div>
        <TaskList
          milestoneId={milestoneId}
          title=""
          showCreate={false}
          isTeamLeader={canManage}
        />
      </div>
    </div>
  );
};

export default MilestoneDetails;
