import React, { useState, useEffect, useMemo } from 'react';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';

const ROLES = ['STUDENT', 'TEAM_LEADER', 'LECTURER', 'ADMIN'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
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

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    return users.filter((user) => {
      const roleOk = roleFilter === 'ALL' || user.role === roleFilter;
      const statusOk = statusFilter === 'ALL' || user.status === statusFilter;
      const searchOk = !term ||
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term);
      return roleOk && statusOk && searchOk;
    });
  }, [users, roleFilter, statusFilter, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        description="Manage roles and account status."
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="field max-w-md"
      />

      <FilterChips
        value={roleFilter}
        onChange={setRoleFilter}
        options={[
          { id: 'ALL', label: 'All roles', count: users.length },
          ...ROLES.map((role) => ({
            id: role,
            label: role.replace('_', ' '),
            count: users.filter((u) => u.role === role).length,
          })),
        ]}
      />

      <FilterChips
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { id: 'ALL', label: 'All statuses' },
          ...STATUSES.map((status) => ({
            id: status,
            label: status.replace('_', ' '),
            count: users.filter((u) => u.status === status).length,
          })),
        ]}
      />

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No users match these filters."
        />
      ) : (
        <div className="surface">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="border-b border-gray-100 last:border-0">
                    <td>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </td>
                    <td className="text-gray-600">{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        disabled={savingId === user.userId}
                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                        className="field !py-1.5 !px-2 text-sm max-w-[11rem]"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={user.status}
                        disabled={savingId === user.userId}
                        onChange={(e) => handleStatusChange(user.userId, e.target.value)}
                        className="field !py-1.5 !px-2 text-sm max-w-[13rem]"
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
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
