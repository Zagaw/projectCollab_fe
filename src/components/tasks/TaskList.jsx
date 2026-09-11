import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { ListTodo, Plus } from 'lucide-react';

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

  const createPath = `${basePath}/tasks/create?projectId=${projectId}&teamId=${teamId}&milestoneId=${milestoneId}`;

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
          <p className="text-sm text-gray-600">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {showCreate && (
          <button
            type="button"
            onClick={() => navigate(createPath)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Create task
          </button>
        )}
      </div>

      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { id: 'ALL', label: 'All', count: tasks.length },
          { id: 'TODO', label: 'To do', count: tasks.filter((t) => t.status === 'TODO').length },
          { id: 'IN_PROGRESS', label: 'In progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
          { id: 'COMPLETED', label: 'Completed', count: tasks.filter((t) => t.status === 'COMPLETED').length },
          { id: 'BLOCKED', label: 'Blocked', count: tasks.filter((t) => t.status === 'BLOCKED').length },
        ]}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="No tasks match this filter."
          actionText={showCreate ? 'Create first task' : undefined}
          onAction={showCreate ? () => navigate(`${basePath}/tasks/create?projectId=${projectId}&teamId=${teamId}`) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              detailsTo={`${basePath}/tasks/${task.taskId}`}
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
