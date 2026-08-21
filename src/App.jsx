import React, { useState } from 'react';
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

// File Management Wrapper
import FilesPage from './components/File/FilesPage';

// Meetings Management Wrapper
import MeetingsPage from './components/meetings/MeetingsPage';

// Comment Components
import CommentList from './components/comments/CommentList';
import CommentInput from './components/comments/CommentInput';

// Discussion Components
import DiscussionList from './components/discussions/DiscussionList';
import DiscussionInput from './components/discussions/DiscussionInput';

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
import ProfilePage from './components/profile/ProfilePage';

// Integrated Comment Thread Container Component
const ProjectCommentsSection = () => {
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Aung Ko',
      text: 'Please review the latest project scope document uploaded in the Files tab.',
      createdAt: 'Aug 21, 2026',
      replies: [
        {
          id: '1-1',
          author: 'Student User',
          text: 'Got it! I will check and update the revisions.',
          createdAt: 'Aug 21, 2026',
          replies: [],
        },
      ],
    },
  ]);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now().toString(),
      author: 'Student User',
      text,
      createdAt: 'Just now',
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const addReplyToComment = (commentList, parentId, newReply) => {
    return commentList.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleAddReply = (parentId, text) => {
    const newReply = {
      id: Date.now().toString(),
      author: 'Student User',
      text,
      createdAt: 'Just now',
      replies: [],
    };
    setComments((prev) => addReplyToComment(prev, parentId, newReply));
  };

  const deleteCommentFromList = (commentList, targetId) => {
    return commentList
      .filter((comment) => comment.id !== targetId)
      .map((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: deleteCommentFromList(comment.replies, targetId),
          };
        }
        return comment;
      });
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => deleteCommentFromList(prev, commentId));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(27,58,104,0.08)] border border-[#1B3A68]/5 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">DISCUSSION</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-1">Project Comments</h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#1B3A68] flex items-center justify-center text-[#FEF199] font-bold shadow-md">
            ✦
          </div>
        </div>

        <CommentInput onSubmit={handleAddComment} placeholder="Ask a question or leave feedback..." />

        <CommentList
          comments={comments}
          onDelete={handleDeleteComment}
          onReply={handleAddReply}
        />
      </div>
    </div>
  );
};

// Integrated Discussions Thread Container Component
const ProjectDiscussionsSection = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: '1',
      title: 'Database Schema Optimization for Version 2.0',
      content: 'Should we introduce indexing on project_id and user_id foreign keys? Let us know your thoughts on performance gains.',
      author: 'Dr. Kyaw Swar',
      tag: 'Question',
      createdAt: 'Aug 21, 2026',
      likes: 3,
      replies: [
        {
          id: '101',
          author: 'Student User',
          text: 'Adding composite indexes will definitely speed up our lookup queries!',
          createdAt: 'Just now'
        }
      ]
    }
  ]);

  const handleCreateDiscussion = ({ title, content, tag }) => {
    const newDiscussion = {
      id: Date.now().toString(),
      title,
      content,
      tag,
      author: 'Student User',
      createdAt: 'Just now',
      likes: 0,
      replies: []
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
  };

  const handleLikeDiscussion = (id) => {
    setDiscussions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleDeleteDiscussion = (id) => {
    setDiscussions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReplyDiscussion = (discussionId, text) => {
    const newReply = {
      id: Date.now().toString(),
      author: 'Student User',
      text,
      createdAt: 'Just now'
    };

    setDiscussions((prev) =>
      prev.map((item) =>
        item.id === discussionId
          ? { ...item, replies: [...(item.replies || []), newReply] }
          : item
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(27,58,104,0.08)] border border-[#1B3A68]/5 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">COMMUNITY</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B3A68] mt-1">Discussions & Topics</h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#1B3A68] flex items-center justify-center text-[#FEF199] font-bold shadow-md">
            📢
          </div>
        </div>

        <DiscussionInput onSubmit={handleCreateDiscussion} />

        <DiscussionList
          discussions={discussions}
          onDelete={handleDeleteDiscussion}
          onLike={handleLikeDiscussion}
          onReply={handleReplyDiscussion}
        />
      </div>
    </div>
  );
};

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

            {/* Files, Meetings, Comments & Discussions */}
            <Route path="File" element={<FilesPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="comments" element={<ProjectCommentsSection />} />
            <Route path="discussions" element={<ProjectDiscussionsSection />} />

            <Route path="teams" element={<div>My Teams</div>} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="profile" element={<ProfilePage />} />
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
            <Route path="projects/:projectId" element={
              <div className="space-y-6">
                <ProjectDetails />
                <ProjectCommentsSection />
              </div>
            } />

            {/* Files, Meetings, Comments & Discussions */}
            <Route path="File" element={<FilesPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="comments" element={<ProjectCommentsSection />} />
            <Route path="discussions" element={<ProjectDiscussionsSection />} />

            <Route path="teams" element={<TeamList teams={[]} onTeamUpdate={() => {}} />} />
            <Route path="teams/create" element={<TeamCreate />} />
            <Route path="teams/:teamId" element={<TeamDetails />} />
            <Route path="invitations" element={<InvitationList />} />
            <Route path="profile" element={<ProfilePage />} />
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