import React from 'react';
import AppShell from './AppShell';

const TeamLeaderLayout = () => (
  <AppShell
    homePath="/teamleader/dashboard"
    profilePath="/teamleader/profile"
    roleLabel="Team leader"
    sections={[
      {
        title: 'Home',
        items: [{ name: 'Dashboard', icon: 'home', path: '/teamleader/dashboard' }],
      },
      {
        title: 'Work',
        items: [
          { name: 'Projects', icon: 'folder', path: '/teamleader/projects' },
          { name: 'Teams', icon: 'users', path: '/teamleader/teams' },
          { name: 'Invitations', icon: 'mail', path: '/teamleader/invitations' },
          { name: 'Tasks', icon: 'check', path: '/teamleader/tasks' },
          { name: 'Milestones', icon: 'flag', path: '/teamleader/milestones' },
        ],
      },
      {
        title: 'Collaborate',
        items: [
          { name: 'Discussions', icon: 'chat', path: '/teamleader/discussions' },
          { name: 'Files', icon: 'paperclip', path: '/teamleader/files' },
          { name: 'Meetings', icon: 'video', path: '/teamleader/meetings' },
          { name: 'Calendar', icon: 'calendar', path: '/teamleader/calendar' },
        ],
      },
      {
        title: 'Review',
        items: [
          { name: 'Progress', icon: 'chart', path: '/teamleader/progress' },
          { name: 'Insights', icon: 'spark', path: '/teamleader/insights' },
          { name: 'Reports', icon: 'doc', path: '/teamleader/reports' },
        ],
      },
    ]}
  />
);

export default TeamLeaderLayout;
