import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import projectApi from '../../api/projectApi';
import toast from 'react-hot-toast';
import { PageHeader, StatCard } from '../common/PageHeader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingLecturers: 0,
    totalProjects: 0,
    activeTeams: 0
  });
  const [pendingLecturers, setPendingLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, pendingRes, projectsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/pending-lecturers'),
        projectApi.getAllProjects()
      ]);

      const projects = projectsRes.data || [];
      const teamCount = projects.reduce((sum, project) => sum + (project.teamCount || 0), 0);

      setStats({
        totalUsers: usersRes.data.length,
        pendingLecturers: pendingRes.data.length,
        totalProjects: projects.length,
        activeTeams: teamCount
      });
      setPendingLecturers(pendingRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.put(`/admin/verify-lecturer/${userId}`);
      toast.success('Lecturer verified successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to verify lecturer');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this lecturer registration?')) return;
    
    try {
      await api.put(`/admin/reject-lecturer/${userId}`);
      toast.success('Lecturer registration rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject lecturer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Users, lecturer approval, and campus projects."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Pending lecturers" value={stats.pendingLecturers} warn={stats.pendingLecturers > 0} />
        <StatCard label="Projects" value={stats.totalProjects} />
        <StatCard label="Teams" value={stats.activeTeams} />
      </div>

      {/* Pending Lecturers Section */}
      {pendingLecturers.length > 0 && (
        <div className="surface p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Pending lecturer registrations</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLecturers.map((lecturer) => (
                  <tr key={lecturer.userId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{lecturer.firstName} {lecturer.lastName}</p>
                        <p className="text-xs text-gray-500">@{lecturer.username}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.studentId || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleVerify(lecturer.userId)}
                          className="btn-primary !py-1 !px-3"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(lecturer.userId)}
                          className="btn-danger !py-1 !px-3"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;