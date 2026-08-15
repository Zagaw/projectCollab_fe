import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentDashboard from './components/dashboard/StudentDashboard';
import LecturerDashboard from './components/dashboard/LecturerDashboard';
import TeamLeaderDashboard from './components/dashboard/TeamLeaderDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import RoleBasedRoute from './components/common/RoleBasedRoute';

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
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RoleBasedRoute 
                student={<StudentDashboard />}
                lecturer={<LecturerDashboard />}
                teamLeader={<TeamLeaderDashboard />}
                admin={<AdminDashboard />}
              />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;