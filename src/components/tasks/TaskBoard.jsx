import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'TODO', label: 'To do' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'REVIEW', label: 'Review' },
  { id: 'BLOCKED', label: 'Blocked' },
  { id: 'COMPLETED', label: 'Done' },
];

const TaskBoard = ({ projectId, teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const navigate = useNavigate();

  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  const basePath = isLecturerRoute ? '/lecturer' : isTeamLeaderRoute ? '/teamleader' : isStudentRoute ? '/student' : '/teamleader';
  const canManage = isTeamLeaderRoute || isLecturerRoute;

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
      setTasks(response.data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success('Status updated');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskApi.deleteTask(taskId);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleViewDetails = (taskId) => navigate(`${basePath}/tasks/${taskId}`);

  const handleCreateTask = () => {
    const params = new URLSearchParams();
    if (teamId) params.append('teamId', teamId);
    if (projectId) params.append('projectId', projectId);
    navigate(`${basePath}/tasks/create?${params.toString()}`);
  };

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    REVIEW: tasks.filter((t) => t.status === 'REVIEW').length,
    BLOCKED: tasks.filter((t) => t.status === 'BLOCKED').length,
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const visibleColumns = selectedStatus === 'ALL' ? COLUMNS : COLUMNS.filter((col) => col.id === selectedStatus);

  if (loading) return <LoadingSpinner text="Loading tasks..." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks"
        description={`${counts.ALL} total · ${counts.COMPLETED} completed`}
        actions={
          canManage ? (
            <button type="button" onClick={handleCreateTask} className="btn-primary">
              Create task
            </button>
          ) : null
        }
      />

      <FilterChips
        value={selectedStatus}
        onChange={setSelectedStatus}
        options={[
          { id: 'ALL', label: 'Board', count: counts.ALL },
          ...COLUMNS.map((col) => ({ id: col.id, label: col.label, count: counts[col.id] })),
        ]}
      />

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description={canManage ? 'Create a task to assign work and track status on the board.' : 'Tasks assigned to you will appear here as columns you can update.'}
          actionText={canManage ? 'Create task' : undefined}
          onAction={canManage ? handleCreateTask : undefined}
        />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {visibleColumns.map((col) => {
            const items = tasks.filter((t) => t.status === col.id);
            return (
              <section
                key={col.id}
                className="flex-none w-[min(100%,18.5rem)] sm:flex-1 sm:min-w-[16rem] surface p-3"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-sm font-semibold text-ink">{col.label}</h2>
                  <span className="text-xs text-gray-500">{items.length}</span>
                </div>
                <div className="space-y-2.5 min-h-[4rem]">
                  {items.length === 0 ? (
                    <p className="text-xs text-gray-500 px-1">None</p>
                  ) : (
                    items.map((task) => (
                      <TaskCard
                        key={task.taskId}
                        task={task}
                        compact
                        showActions
                        canDelete={canManage}
                        detailsTo={`${basePath}/tasks/${task.taskId}`}
                        onViewDetails={handleViewDetails}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
