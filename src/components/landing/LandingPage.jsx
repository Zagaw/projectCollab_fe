import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  FolderKanban,
  Users,
  ListTodo,
  Files,
  Video,
  TrendingUp,
  FileBarChart,
  GraduationCap,
  UserRound,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';
import { IconWell } from '../common/PageHeader';
import LoadingSpinner from '../common/LoadingSpinner';

const FEATURES = [
  {
    icon: FolderKanban,
    tone: 'teal',
    title: 'Projects and teams',
    body: 'Create academic projects, form teams, and invite students without leaving Collabora.',
  },
  {
    icon: ListTodo,
    tone: 'sky',
    title: 'Tasks and milestones',
    body: 'Assign work, track deadlines, and see what is overdue before it becomes a problem.',
  },
  {
    icon: Files,
    tone: 'sand',
    title: 'Files and discussions',
    body: 'Keep reports, designs, and conversation threads next to the project they belong to.',
  },
  {
    icon: Video,
    tone: 'sky',
    title: 'Meetings and calendar',
    body: 'Schedule team meetings with an agenda and a shared link. Deadlines sit on the same calendar.',
  },
  {
    icon: TrendingUp,
    tone: 'teal',
    title: 'Progress you can show',
    body: 'Task completion and member contributions stay visible to the team and the lecturer.',
  },
  {
    icon: FileBarChart,
    tone: 'sand',
    title: 'Reports for review',
    body: 'Preview progress on screen, download CSV, or print a PDF for weekly check-ins.',
  },
];

const ROLES = [
  {
    icon: GraduationCap,
    tone: 'sky',
    title: 'Students',
    body: 'Join a team, update your tasks, share files, and see what is due this week.',
  },
  {
    icon: Users,
    tone: 'teal',
    title: 'Team leaders',
    body: 'Invite members, assign work, set milestones, and keep meetings and minutes in one place.',
  },
  {
    icon: UserRound,
    tone: 'sand',
    title: 'Lecturers',
    body: 'Supervise every team in your projects. Filter tasks, compare progress, and export reports.',
  },
];

const LandingPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <BrandLogo to="/" onPaper />
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary !py-2">
              Log in
            </Link>
            <Link to="/register" className="btn-primary !py-2">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-700">
            University group projects
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight">
            Campus project work, in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Collaborate. Build. Achieve. Teams, tasks, files, meetings, and progress for academic projects — with a clear view for students and lecturers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="btn-primary">
              Get started
            </Link>
            <Link to="/login" className="btn-secondary">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <article key={role.title} className="surface p-5">
              <IconWell tone={role.tone}>
                <role.icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
              </IconWell>
              <h2 className="mt-4 font-semibold text-ink">{role.title}</h2>
              <p className="mt-1.5 text-sm text-gray-600">{role.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">What you can do in Collabora</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            One workspace instead of scattered chats, drives, and spreadsheets.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="surface p-5">
                <IconWell tone={feature.tone}>
                  <feature.icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                </IconWell>
                <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="surface overflow-hidden relative bg-ink text-white p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sand text-sm font-medium">
                <Shield className="w-4 h-4" strokeWidth={2} aria-hidden />
                Role-based access
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Ready to run your next group project here?
              </h2>
              <p className="mt-2 text-white/70 max-w-xl">
                Create an account as a student or lecturer. Lecturers are verified by an administrator before they can supervise projects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-white text-ink hover:bg-gray-50 transition">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 Collabora</p>
          <p>Collaborate. Build. Achieve.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
