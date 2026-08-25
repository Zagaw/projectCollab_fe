import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TaskList = ({ 
  projectId, 
  teamId, 
  milestoneId, 
  title = 'Tasks',
  showCreate = false,
  isTeamLeader = false
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  // Determine base path
  const isLecturerRoute = window.location.pathname.includes('/lecturer');
  const isTeamLeaderRoute = window.location.pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' : isTeamLeaderRoute ? '/teamleader' : '/student';

  useEffect(() => {
    fetchTasks();
  }, [projectId, teamId, milestoneId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      if (milestoneId) {
        response = await taskApi.getTasksByMilestone(milestoneId);
      } else if (teamId) {
        response = await taskApi.getTasksByTeam(teamId);
      } else if (projectId) {
        response = await taskApi.getTasksByProject(projectId);
      } else {
        response = await taskApi.getMyTasks();
      }
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskApi.deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleViewDetails = (taskId) => {
    navigate(`${basePath}/tasks/${taskId}`);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    if (filter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (filter === 'TODO') return t.status === 'TODO';
    if (filter === 'BLOCKED') return t.status === 'BLOCKED';
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          <p className="text-sm text-gray-600">
            {tasks.length} task(s) found
          </p>
        </div>
        {showCreate && (
          <button
            onClick={() => navigate(`${basePath}/tasks/create?projectId=${projectId}&teamId=${teamId}&milestoneId=${milestoneId}`)}
            className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span>➕</span> Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'ALL' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500">No tasks found</p>
          {showCreate && (
            <button
              onClick={() => navigate(`${basePath}/tasks/create?projectId=${projectId}&teamId=${teamId}`)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              showActions={isTeamLeader}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;