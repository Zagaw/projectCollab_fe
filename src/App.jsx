import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PendingVerification from './components/auth/PendingVerification';

// Layout Components
import StudentLayout from './components/layout/StudentLayout';
import LecturerLayout from './components/layout/LecturerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Dashboard Components
import StudentDashboard from './components/dashboard/StudentDashboard';
import LecturerDashboard from './components/dashboard/LecturerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Project Components
import ProjectList from './components/projects/ProjectList';
import ProjectCreate from './components/projects/ProjectCreate';
import ProjectDetails from './components/projects/ProjectDetails';

// Team Components
import TeamList from './components/teams/TeamList';
import TeamCreate from './components/teams/TeamCreate';
import TeamDetails from './components/teams/TeamDetails';

// Invitation Components
import InvitationList from './components/invitations/InvitationList';

// Admin Components
import PendingLecturers from './components/admin/PendingLecturers';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="projects" element={<div>My Projects</div>} />
            <Route path="teams" element={<div>My Teams</div>} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="profile" element={<div>Profile</div>} />
          </Route>

          {/* Lecturer Routes */}
          <Route path="/lecturer" element={
            <ProtectedRoute>
              <LecturerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="dashboard" element={<LecturerDashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/create" element={<ProjectCreate />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="teams" element={<TeamList teams={[]} onTeamUpdate={() => {}} />} />
            <Route path="teams/create" element={<TeamCreate />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="profile" element={<div>Profile</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pending-lecturers" element={<PendingLecturers />} />
            <Route path="users" element={<div>Manage Users</div>} />
            <Route path="projects" element={<div>All Projects</div>} />
            <Route path="profile" element={<div>Profile</div>} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;