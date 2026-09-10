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
import TeamLeaderLayout from './components/layout/TeamLeaderLayout';

// Dashboard Components
import StudentDashboard from './components/dashboard/StudentDashboard';
import LecturerDashboard from './components/dashboard/LecturerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import TeamLeaderDashboard from './components/dashboard/TeamLeaderDashboard';

// Project Components
import ProjectList from './components/projects/ProjectList';
import ProjectCreate from './components/projects/ProjectCreate';
import ProjectEdit from './components/projects/ProjectEdit';
import ProjectDetails from './components/projects/ProjectDetails';
import StudentProjects from './components/projects/StudentProjects';

// Team Components
import TeamCreate from './components/teams/TeamCreate';
import TeamDetails from './components/teams/TeamDetails';
import StudentTeamList from './components/teams/StudentTeamList';
import LecturerTeamList from './components/teams/LecturerTeamList';

// Invitation Components
import InvitationList from './components/invitations/InvitationList';

// Admin Components
import PendingLecturers from './components/admin/PendingLecturers';
import AdminUserList from './components/admin/AdminUserList';
import AdminProjectList from './components/admin/AdminProjectList';

// Milestone Components
import LecturerMilestoneMonitor from './components/milestones/LecturerMilestoneMonitor';
import MilestoneCreate from './components/milestones/MilestoneCreate';
import MilestoneDetails from './components/milestones/MilestoneDetails';
import StudentMilestoneView from './components/milestones/StudentMilestoneView';
import TeamLeaderMilestoneCreate from './components/milestones/TeamLeaderMilestoneCreate';

// Task Components
import TaskList from './components/tasks/TaskList';
import TaskBoard from './components/tasks/TaskBoard';
import LecturerTaskMonitor from './components/tasks/LecturerTaskMonitor';
import TaskCreate from './components/tasks/TaskCreate';
import TaskDetails from './components/tasks/TaskDetails';
import TeamLeaderTaskCreate from './components/tasks/TeamLeaderTaskCreate';

// Profile Component
import ProfilePage from './components/profile/ProfilePage';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

import CommentList from './components/comments/CommentList';
import DiscussionList from './components/discussions/DiscussionList';
import DiscussionCreate from './components/discussions/DiscussionCreate';
import DiscussionDetails from './components/discussions/DiscussionDetails';

import StudentProjectList from './components/projects/StudentProjectList';
import StudentProjectDetails from './components/projects/StudentProjectDetails';
import FileLibraryPage from './components/files/FileLibraryPage';
import MeetingList from './components/meetings/MeetingList';
import MeetingCreate from './components/meetings/MeetingCreate';
import MeetingDetails from './components/meetings/MeetingDetails';
import LecturerMeetingMonitor from './components/meetings/LecturerMeetingMonitor';
import CalendarPage from './components/calendar/CalendarPage';

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

          {/* ===== MAIN DASHBOARD REDIRECT ===== */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleBasedRoute 
                student={<Navigate to="/student/dashboard" replace />}
                lecturer={<Navigate to="/lecturer/dashboard" replace />}
                teamLeader={<Navigate to="/teamleader/dashboard" replace />}
                admin={<Navigate to="/admin/dashboard" replace />}
              />
            </ProtectedRoute>
          } />

          {/* ===== STUDENT ROUTES ===== */}
          <Route path="/student" element={
            <ProtectedRoute>
              <RoleBasedRoute 
                student={<StudentLayout />}
                lecturer={<Navigate to="/lecturer/dashboard" replace />}
                teamLeader={<Navigate to="/teamleader/dashboard" replace />}
                admin={<Navigate to="/admin/dashboard" replace />}
              />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="projects" element={<StudentProjectList />} />
            <Route path="projects/:projectId" element={<StudentProjectDetails />} />
            <Route path="teams" element={<StudentTeamList />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="milestones" element={<StudentMilestoneView />} />
            <Route path="milestones/:milestoneId" element={<MilestoneDetails />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="discussions" element={<DiscussionList />} />
            <Route path="discussions/:discussionId" element={<DiscussionDetails />} />
            <Route path="files" element={<FileLibraryPage />} />
            <Route path="meetings" element={<MeetingList />} />
            <Route path="meetings/:meetingId" element={<MeetingDetails />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ===== TEAM LEADER ROUTES ===== */}
          <Route path="/teamleader" element={
            <ProtectedRoute>
              <RoleBasedRoute 
                student={<Navigate to="/student/dashboard" replace />}
                lecturer={<Navigate to="/lecturer/dashboard" replace />}
                teamLeader={<TeamLeaderLayout />}
                admin={<Navigate to="/admin/dashboard" replace />}
              />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/teamleader/dashboard" replace />} />
            <Route path="dashboard" element={<TeamLeaderDashboard />} />
            <Route path="projects" element={<StudentProjectList />} />
            <Route path="projects/:projectId" element={<StudentProjectDetails />} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="teams" element={<StudentTeamList />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="milestones" element={<StudentMilestoneView />} />
            <Route path="milestones/create" element={<TeamLeaderMilestoneCreate />} />
            <Route path="milestones/:milestoneId" element={<MilestoneDetails />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="tasks/create" element={<TeamLeaderTaskCreate />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="discussions" element={<DiscussionList />} />
            <Route path="discussions/create" element={<DiscussionCreate />} />
            <Route path="discussions/:discussionId" element={<DiscussionDetails />} />
            <Route path="files" element={<FileLibraryPage />} />
            <Route path="meetings" element={<MeetingList />} />
            <Route path="meetings/create" element={<MeetingCreate />} />
            <Route path="meetings/:meetingId" element={<MeetingDetails />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ===== LECTURER ROUTES ===== */}
          <Route path="/lecturer" element={
            <ProtectedRoute>
              <RoleBasedRoute 
                student={<Navigate to="/student/dashboard" replace />}
                lecturer={<LecturerLayout />}
                teamLeader={<Navigate to="/teamleader/dashboard" replace />}
                admin={<Navigate to="/admin/dashboard" replace />}
              />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="dashboard" element={<LecturerDashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/create" element={<ProjectCreate />} />
            <Route path="projects/:projectId/edit" element={<ProjectEdit />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="teams" element={<LecturerTeamList />} />
            <Route path="teams/create" element={<TeamCreate />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="milestones" element={<LecturerMilestoneMonitor />} />
            <Route path="milestones/create" element={<MilestoneCreate />} />
            <Route path="milestones/:milestoneId" element={<MilestoneDetails />} />
            <Route path="tasks" element={<LecturerTaskMonitor />} />
            <Route path="tasks/create" element={<TaskCreate />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="discussions" element={<DiscussionList />} />
            <Route path="discussions/create" element={<DiscussionCreate />} />
            <Route path="discussions/:discussionId" element={<DiscussionDetails />} />
            <Route path="files" element={<FileLibraryPage />} />
            <Route path="meetings" element={<LecturerMeetingMonitor />} />
            <Route path="meetings/:meetingId" element={<MeetingDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <RoleBasedRoute 
                student={<Navigate to="/student/dashboard" replace />}
                lecturer={<Navigate to="/lecturer/dashboard" replace />}
                teamLeader={<Navigate to="/teamleader/dashboard" replace />}
                admin={<AdminLayout />}
              />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pending-lecturers" element={<PendingLecturers />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="projects" element={<AdminProjectList />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;