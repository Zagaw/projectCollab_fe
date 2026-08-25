import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TaskBoard = ({ projectId, teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const navigate = useNavigate();

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/teamleader';

  useEffect(() => {
    fetchTasks();
  }, [projectId, teamId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      if (teamId) {
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

  const handleCreateTask = () => {
    const params = new URLSearchParams();
    if (teamId) params.append('teamId', teamId);
    if (projectId) params.append('projectId', projectId);
    navigate(`${basePath}/tasks/create?${params.toString()}`);
  };

  const filteredTasks = selectedStatus === 'ALL' 
    ? tasks 
    : tasks.filter(t => t.status === selectedStatus);

  // Count tasks by status
  const statusCounts = {
    ALL: tasks.length,
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    REVIEW: tasks.filter(t => t.status === 'REVIEW').length,
    BLOCKED: tasks.filter(t => t.status === 'BLOCKED').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-gray-600">
            {tasks.length} task(s) • {statusCounts.COMPLETED} completed
          </p>
        </div>
        {(isTeamLeaderRoute || isLecturerRoute) && (
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        )}
      </div>

      {/* Status Filter - Modern Pill Design */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedStatus === status
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
              selectedStatus === status 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Task Cards Grid - Clean Card Design */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-500">
            {tasks.length === 0 
              ? 'No tasks have been created yet.'
              : 'No tasks match the selected filter.'}
          </p>
          {(isTeamLeaderRoute || isLecturerRoute) && tasks.length === 0 && (
            <button
              onClick={handleCreateTask}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isOverdue = task.deadline && 
              new Date(task.deadline) < new Date() && 
              task.status !== 'COMPLETED';

            return (
              <div
                key={task.taskId}
                className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all ${
                  task.status === 'COMPLETED' ? 'border-green-200' :
                  isOverdue ? 'border-red-200' : 'border-gray-100'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer flex-1"
                    onClick={() => handleViewDetails(task.taskId)}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    <TaskPriorityBadge priority={task.priority} />
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Meta Info - Compact */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                  {task.projectTitle && (
                    <span className="px-2 py-1 bg-gray-100 rounded">📁 {task.projectTitle}</span>
                  )}
                  {task.teamName && (
                    <span className="px-2 py-1 bg-gray-100 rounded">👥 {task.teamName}</span>
                  )}
                  {task.assignedToName && (
                    <span className="px-2 py-1 bg-gray-100 rounded">👤 {task.assignedToName}</span>
                  )}
                </div>

                {/* Deadline & Status */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {task.deadline && (
                      <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        📅 {new Date(task.deadline).toLocaleDateString()}
                        {isOverdue && ' ⚠️'}
                      </span>
                    )}
                  </div>
                  <TaskStatusBadge status={task.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(task.taskId)}
                    className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition text-center"
                  >
                    View Details
                  </button>
                  {task.status !== 'COMPLETED' && (
                    <select
                      onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={task.status}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="COMPLETED">Done</option>
                    </select>
                  )}
                  {(isTeamLeaderRoute || isLecturerRoute) && (
                    <button
                      onClick={() => handleDelete(task.taskId)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;