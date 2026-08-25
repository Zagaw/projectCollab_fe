import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import invitationApi from '../../api/invitationApi';
import TaskCard from '../tasks/TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    pendingInvitations: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks assigned to student
      const tasksRes = await taskApi.getMyTasks();
      const tasks = tasksRes.data || [];
      
      // Fetch pending invitations
      const invitesRes = await invitationApi.getMyInvitations();
      const invites = invitesRes.data || [];
      
      // Calculate stats
      const completed = tasks.filter(t => t.status === 'COMPLETED').length;
      const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length;
      const overdue = tasks.filter(t => 
        t.status !== 'COMPLETED' && 
        t.deadline && new Date(t.deadline) < new Date()
      ).length;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        overdueTasks: overdue,
        pendingInvitations: invites.length
      });
      
      setRecentTasks(tasks.slice(0, 5));
      setPendingInvitations(invites.slice(0, 3));
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success('Task status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    // Students cannot delete tasks
    toast.error('You are not authorized to delete tasks');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Invitations</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvitations}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Recent Tasks</h2>
            <Link to="/student/tasks" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onViewDetails={(taskId) => navigate(`/student/tasks/${taskId}`)}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
          )}
        </div>

        {/* Pending Invitations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Invitations</h2>
            <Link to="/student/invitations" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          {pendingInvitations.length > 0 ? (
            <div className="space-y-3">
              {pendingInvitations.map((invite) => (
                <div key={invite.invitationId} className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <p className="font-medium text-gray-900">{invite.teamName}</p>
                  <p className="text-sm text-gray-600">{invite.projectTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">Invited by: {invite.inviterName}</p>
                  <Link
                    to="/student/invitations"
                    className="mt-2 inline-block px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                  >
                    Review Invitation
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No pending invitations.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;