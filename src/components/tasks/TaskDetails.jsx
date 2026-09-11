import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import commentApi from '../../api/commentApi';
import CommentList from '../comments/CommentList';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const isStudentRoute = pathname.includes('/student');
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/teamleader';

  useEffect(() => {
    fetchTaskDetails();
    fetchComments();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTaskById(taskId);
      setTask(response.data);
      setEditData(response.data);
    } catch (error) {
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch comments for this task
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await commentApi.getCommentsForTask(taskId);
      setComments(response.data || []);
    } catch (error) {
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success('Task status updated');
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await taskApi.updateTask(taskId, {
        ...editData,
        status: editData.status,
        priority: editData.priority
      });
      toast.success('Task updated successfully');
      setIsEditing(false);
      fetchTaskDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskApi.deleteTask(taskId);
      toast.success('Task deleted successfully');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  // ✅ NEW: Handle comment added to task
  const handleCommentAdded = async (formData) => {
    try {
      const response = await commentApi.addCommentToTask(taskId, formData);
      toast.success('Comment added!');
      // Refresh comments
      await fetchComments();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add comment');
      throw error;
    }
  };

  // ✅ NEW: Handle comment updated
  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map(c => 
      c.commentId === updatedComment.commentId ? updatedComment : c
    ));
  };

  // ✅ NEW: Handle comment deleted
  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c.commentId !== commentId));
  };

  if (loading) return <LoadingSpinner text="Loading task..." />;
  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="It may have been deleted, or you do not have access."
        actionText="Back to tasks"
        actionLink={`${basePath}/tasks`}
      />
    );
  }

  const isOverdue = task.deadline && 
    new Date(task.deadline) < new Date() && 
    task.status !== 'COMPLETED';

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button type="button" onClick={() => navigate(`${basePath}/tasks`)} className="text-sm text-indigo-700 hover:text-indigo-800 mb-2">
            Back to tasks
          </button>
          <h1 className="page-title">{task.title}</h1>
          <p className="page-kicker">
            {task.projectTitle}
            {task.teamName ? ` · ${task.teamName}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
          {isOverdue && (
            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">Overdue</span>
          )}
          <button type="button" onClick={() => setIsEditing(!isEditing)} className="btn-secondary">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {(isTeamLeaderRoute || isLecturerRoute) && (
            <button type="button" onClick={handleDelete} className="btn-danger">Delete</button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="surface p-5 sm:p-6 space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" value={editData.title || ''} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="field" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows="4" value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select value={editData.status || 'TODO'} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="field">
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="REVIEW">Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select value={editData.priority || 'MEDIUM'} onChange={(e) => setEditData({ ...editData, priority: e.target.value })} className="field">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 surface p-5 sm:p-6">
            <h3 className="font-semibold text-ink mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description || 'No description yet.'}</p>
            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Assignee</dt><dd className="font-medium">{task.assignedToName || 'Unassigned'}</dd></div>
              <div><dt className="text-gray-500">Created by</dt><dd className="font-medium">{task.createdByName}</dd></div>
              {task.milestoneTitle && (
                <div><dt className="text-gray-500">Milestone</dt><dd className="font-medium">{task.milestoneTitle}</dd></div>
              )}
            </dl>
          </div>
          <aside className="surface p-5 sm:p-6">
            <h3 className="font-semibold text-ink mb-3">Dates and status</h3>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-ink'}`}>
              Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
              {isOverdue ? ' (overdue)' : ''}
            </p>
            {task.completedAt && (
              <p className="text-sm text-gray-600 mt-2">Completed {new Date(task.completedAt).toLocaleDateString()}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Created {new Date(task.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 space-y-2">
              {['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  disabled={status === task.status}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg ${
                    status === task.status ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <div className="surface p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Comments ({comments.length})</h3>
        <CommentList
          entityType="task"
          entityId={taskId}
          comments={comments}
          onCommentAdded={handleCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          isLoading={commentsLoading}
        />
      </div>
    </div>
  );
};

export default TaskDetails;