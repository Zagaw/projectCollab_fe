import React, { useState, useEffect } from 'react';
import userApi from '../../api/userApi';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const StudentSearchList = ({ selectedUserId, onSelect, onClose }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'NOT_IN_TEAM' | 'IN_TEAM'

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAvailableUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Helper function to check if user is in any team
  const isInAnyTeam = (user) => {
    return user.currentTeams && user.currentTeams.length > 0;
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term)
      );
    }

    // Apply team filter
    if (filter === 'NOT_IN_TEAM') {
      filtered = filtered.filter(user => !isInAnyTeam(user));
    } else if (filter === 'IN_TEAM') {
      filtered = filtered.filter(user => isInAnyTeam(user));
    }

    setFilteredUsers(filtered);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner text="Loading students..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
        >
          <option value="ALL">All Students</option>
          <option value="NOT_IN_TEAM">Not in any team</option>
          <option value="IN_TEAM">Currently in teams</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {filteredUsers.length} student{filteredUsers.length !== 1 ? 's' : ''} found
      </p>

      {/* User List */}
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No students found</p>
            {searchTerm && (
              <p className="text-sm">Try a different search term</p>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUserId === user.userId;
            const inTeam = isInAnyTeam(user);

            return (
              <div
                key={user.userId}
                onClick={() => onSelect(user)}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <span className="text-xs text-gray-500">@{user.username}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {inTeam ? (
                      <span className="text-xs text-gray-500">
                        📊 In {user.currentTeams.length} team{user.currentTeams.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">
                        🆕 Available - Not in any team
                      </span>
                    )}
                    {user.currentTeams && user.currentTeams.length > 0 && (
                      <span className="text-xs text-gray-400 truncate">
                        ({user.currentTeams.map(t => t.teamName).join(', ')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 text-indigo-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentSearchList;