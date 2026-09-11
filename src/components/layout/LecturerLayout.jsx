import React from 'react';
import AppShell from './AppShell';

const LecturerLayout = () => (
  <AppShell
    homePath="/lecturer/dashboard"
    profilePath="/lecturer/profile"
    roleLabel="Lecturer"
    sections={[
      {
        title: 'Home',
        items: [{ name: 'Dashboard', icon: 'home', path: '/lecturer/dashboard' }],
      },
      {
        title: 'Work',
        items: [
          { name: 'Projects', icon: 'folder', path: '/lecturer/projects' },
          { name: 'Teams', icon: 'users', path: '/lecturer/teams' },
          { name: 'Tasks', icon: 'check', path: '/lecturer/tasks' },
          { name: 'Milestones', icon: 'flag', path: '/lecturer/milestones' },
        ],
      },
      {
        title: 'Collaborate',
        items: [
          { name: 'Discussions', icon: 'chat', path: '/lecturer/discussions' },
          { name: 'Files', icon: 'paperclip', path: '/lecturer/files' },
          { name: 'Meetings', icon: 'video', path: '/lecturer/meetings' },
        ],
      },
      {
        title: 'Review',
        items: [
          { name: 'Progress', icon: 'chart', path: '/lecturer/progress' },
          { name: 'Insights', icon: 'spark', path: '/lecturer/insights' },
          { name: 'Reports', icon: 'doc', path: '/lecturer/reports' },
        ],
      },
    ]}
  />
);

export default LecturerLayout;
