import React from 'react';
import AppShell from './AppShell';

const StudentLayout = () => (
  <AppShell
    homePath="/student/dashboard"
    profilePath="/student/profile"
    roleLabel="Student"
    sections={[
      {
        title: 'Home',
        items: [{ name: 'Dashboard', icon: 'home', path: '/student/dashboard' }],
      },
      {
        title: 'Work',
        items: [
          { name: 'Projects', icon: 'folder', path: '/student/projects' },
          { name: 'Teams', icon: 'users', path: '/student/teams' },
          { name: 'Invitations', icon: 'mail', path: '/student/invitations' },
          { name: 'Tasks', icon: 'check', path: '/student/tasks' },
          { name: 'Milestones', icon: 'flag', path: '/student/milestones' },
        ],
      },
      {
        title: 'Collaborate',
        items: [
          { name: 'Discussions', icon: 'chat', path: '/student/discussions' },
          { name: 'Files', icon: 'paperclip', path: '/student/files' },
          { name: 'Meetings', icon: 'video', path: '/student/meetings' },
          { name: 'Calendar', icon: 'calendar', path: '/student/calendar' },
        ],
      },
      {
        title: 'Review',
        items: [
          { name: 'Progress', icon: 'chart', path: '/student/progress' },
          { name: 'Reports', icon: 'doc', path: '/student/reports' },
        ],
      },
    ]}
  />
);

export default StudentLayout;
