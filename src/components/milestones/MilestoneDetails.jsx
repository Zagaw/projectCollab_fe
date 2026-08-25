import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import taskApi from '../../api/taskApi';
import TaskList from '../tasks/TaskList';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const MilestoneDetails = () => {
  const { milestoneId } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine base path for navigation
  const isLecturerRoute = window.location.pathname.includes('/lecturer');
  const isTeamLeaderRoute = window.location.pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' : isTeamLeaderRoute ? '/teamleader' : '/student';

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
  if (!milestone) return <div>Milestone not found</div>;

  const isOverdue = milestone.deadline && 
    new Date(milestone.deadline) < new Date() && 
    !milestone.isCompleted;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={handleBack}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Milestones
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{milestone.title}</h1>
          <p className="text-gray-600">
            {milestone.projectTitle} • {milestone.teamName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            milestone.isCompleted ? 'bg-green-100 text-green-700' :
            isOverdue ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {milestone.isCompleted ? '✅ Completed' :
             isOverdue ? '⚠️ Overdue' : '⏳ In Progress'}
          </span>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-2"
          >
            <span>➕</span> Create Task
          </button>
          {!milestone.isCompleted && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600">{milestone.description || 'No description provided'}</p>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Team:</span>
              <span className="ml-1">{milestone.teamName}</span>
            </div>
            <div>
              <span className="font-medium">Created By:</span>
              <span className="ml-1">{milestone.createdByName}</span>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-1">{new Date(milestone.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Milestone Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Deadline:</span>
              <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {new Date(milestone.deadline).toLocaleDateString()}
                {isOverdue && ' ⚠️ Overdue'}
              </p>
            </div>
            {milestone.completedAt && (
              <div>
                <span className="text-gray-500">Completed:</span>
                <p className="font-medium text-green-600">
                  {new Date(milestone.completedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Tasks:</span>
              <p className="font-medium">{tasks.length} tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Tasks for this Milestone</h3>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-2"
          >
            <span>➕</span> Add Task
          </button>
        </div>
        <TaskList 
          milestoneId={milestoneId}
          title=""
          showCreate={false}
          isTeamLeader={true}
        />
      </div>
    </div>
  );
};

export default MilestoneDetails;