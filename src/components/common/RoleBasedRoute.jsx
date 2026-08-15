import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ student, lecturer, teamLeader, admin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Map user role to component
  const roleComponents = {
    'STUDENT': student,
    'LECTURER': lecturer,
    'TEAM_LEADER': teamLeader,
    'ADMIN': admin
  };

  // Get component based on user role, fallback to student if not found
  const Component = roleComponents[user.role] || student;

  return Component;
};

export default RoleBasedRoute;