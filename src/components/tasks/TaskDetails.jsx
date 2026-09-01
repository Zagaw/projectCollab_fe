import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import commentApi from '../../api/commentApi';
import CommentList from '../comments/CommentList';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import LoadingSpinner from '../common/LoadingSpinner';
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

  if (loading) return <LoadingSpinner />;
  if (!task) return <div>Task not found</div>;

  const isOverdue = task.deadline && 
    new Date(task.deadline) < new Date() && 
    task.status !== 'COMPLETED';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600">
            {task.projectTitle} • {task.teamName || 'No Team'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
          {isOverdue && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              ⚠️ Overdue
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        // Edit Form
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editData.title || ''}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows="4"
                value={editData.description || ''}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editData.status || 'TODO'}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">In Review</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={editData.priority || 'MEDIUM'}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      ) : (
        // View Mode
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600">{task.description || 'No description provided'}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Project:</span>
                <span className="ml-1">{task.projectTitle}</span>
              </div>
              <div>
                <span className="font-medium">Team:</span>
                <span className="ml-1">{task.teamName || 'Not assigned'}</span>
              </div>
              <div>
                <span className="font-medium">Assigned To:</span>
                <span className="ml-1">{task.assignedToName || 'Unassigned'}</span>
              </div>
              <div>
                <span className="font-medium">Created By:</span>
                <span className="ml-1">{task.createdByName}</span>
              </div>
              {task.milestoneTitle && (
                <div>
                  <span className="font-medium">Milestone:</span>
                  <span className="ml-1 text-indigo-600">{task.milestoneTitle}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Task Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Deadline:</span>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  {isOverdue && ' ⚠️ Overdue'}
                </p>
              </div>
              {task.completedAt && (
                <div>
                  <span className="text-gray-500">Completed:</span>
                  <p className="font-medium text-green-600">
                    {new Date(task.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Created:</span>
                <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <p className="font-medium">{new Date(task.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <hr className="my-4" />
            <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
            <div className="space-y-2">
              {['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={status === task.status}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition ${
                    status === task.status
                      ? 'bg-indigo-100 text-indigo-600 cursor-default'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === task.status ? '✓ ' : ''}
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Comments Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>
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