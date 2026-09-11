import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-paper">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              to="/"
              className="block text-sm font-medium text-indigo-700 hover:text-indigo-800 mb-4"
            >
              ← Back to home
            </Link>
            <Link to="/" className="block mb-8">
              <img
                src="/collabora-logo.png"
                alt="Collabora"
                className="h-14 w-auto max-w-[220px] object-contain"
              />
            </Link>
            <h2 className="page-title">{title}</h2>
            <p className="page-kicker">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-ink p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-600" aria-hidden />
        <div className="absolute inset-y-0 left-1.5 w-1 bg-sand" aria-hidden />
        <div>
          <img
            src="/collabora-logo.png"
            alt="Collabora"
            className="h-16 w-auto max-w-[280px] object-contain bg-white rounded-2xl p-2 mb-10"
          />
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Campus project work, in one place.
          </h1>
          <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-md">
            Collaborate. Build. Achieve. Teams, tasks, files, meetings, and progress for university group projects.
          </p>
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-medium">Shared workspace</p>
              <p className="text-white/60 mt-1">Projects, teams, and files without hopping between apps.</p>
            </div>
            <div>
              <p className="font-medium">Clear ownership</p>
              <p className="text-white/60 mt-1">Tasks, milestones, and contributions stay visible to the team and lecturer.</p>
            </div>
            <div>
              <p className="font-medium">Supervision without noise</p>
              <p className="text-white/60 mt-1">Progress, reports, and meeting notes in the same product.</p>
            </div>
          </div>
        </div>
        <p className="text-white/40 text-sm">© 2026 Collabora</p>
      </div>
    </div>
  );
};

export default AuthLayout;
