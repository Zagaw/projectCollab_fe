import React from 'react';
import AppShell from './AppShell';

const AdminLayout = () => (
  <AppShell
    homePath="/admin/dashboard"
    profilePath="/admin/profile"
    roleLabel="Admin"
    sections={[
      {
        title: 'Home',
        items: [{ name: 'Dashboard', icon: 'home', path: '/admin/dashboard' }],
      },
      {
        title: 'Manage',
        items: [
          { name: 'Pending lecturers', icon: 'clock', path: '/admin/pending-lecturers' },
          { name: 'Users', icon: 'users', path: '/admin/users' },
          { name: 'Projects', icon: 'folder', path: '/admin/projects' },
        ],
      },
    ]}
  />
);

export default AdminLayout;
