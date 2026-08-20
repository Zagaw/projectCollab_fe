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
    return <Navigate to="/login" replace />;
  }

  // Map user role to component
  const roleMap = {
    'STUDENT': student,
    'LECTURER': lecturer,
    'TEAM_LEADER': teamLeader || student,
    'ADMIN': admin
  };

  const Component = roleMap[user.role];

  if (!Component) {
    return <Navigate to="/login" replace />;
  }

  return Component;
};

export default RoleBasedRoute;