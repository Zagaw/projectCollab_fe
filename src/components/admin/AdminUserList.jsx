import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ROLES = ['STUDENT', 'TEAM_LEADER', 'LECTURER', 'ADMIN'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setSavingId(userId);
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success('User role updated');
      setUsers(users.map((u) => (u.userId === userId ? { ...u, role } : u)));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  const handleStatusChange = async (userId, status) => {
    setSavingId(userId);
    try {
      await adminApi.updateUserStatus(userId, status);
      toast.success('User status updated');
      setUsers(users.map((u) => (u.userId === userId ? { ...u, status } : u)));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const roleOk = roleFilter === 'ALL' || user.role === roleFilter;
    const statusOk = statusFilter === 'ALL' || user.status === statusFilter;
    return roleOk && statusOk;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-600">Manage roles and account status</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="ALL">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <span className="self-center text-sm text-gray-500">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      disabled={savingId === user.userId}
                      onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={user.status}
                      disabled={savingId === user.userId}
                      onChange={(e) => handleStatusChange(user.userId, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <p className="text-center py-8 text-gray-500">No users match these filters.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
