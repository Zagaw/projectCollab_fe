import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import taskApi from '../../api/taskApi';
import LoadingSpinner from '../common/LoadingSpinner';
import UpcomingMeetings from '../meetings/UpcomingMeetings';
import DashboardProgress from '../progress/DashboardProgress';
import { PageHeader, StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { LayoutDashboard, FolderKanban, Users, ListTodo, CircleCheck, Plus } from 'lucide-react';
import { dashboardGreeting } from '../../utils/userDisplay';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTeams: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
      const [projectsRes, tasksRes] = await Promise.all([
        projectApi.getMyProjects(),
        taskApi.getLecturerTasks().catch(() => ({ data: [] })),
      ]);
      const projects = projectsRes.data || [];
      const allTasks = tasksRes.data || [];
      let totalTeams = 0;
      projects.forEach((p) => { totalTeams += (p.teamCount || 0); });
      
      const completed = allTasks.filter(t => t.status === 'COMPLETED').length;
      
      setStats({
        totalProjects: projects.length,
        totalTeams: totalTeams,
        totalTasks: allTasks.length,
        completedTasks: completed
      });
      
      setRecentProjects(projects.slice(0, 3));
      setRecentTasks(allTasks.slice(0, 5));
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title={dashboardGreeting(user)}
        description="Supervise projects, teams, and student progress."
        actions={
          <Link to="/lecturer/projects/create" className="btn-primary"><Plus className="w-4 h-4" strokeWidth={2} />Create project</Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={FolderKanban} label="Projects" value={stats.totalProjects} />
        <StatCard icon={Users} tone="sky" label="Teams" value={stats.totalTeams} />
        <StatCard icon={ListTodo} tone="violet" label="Tasks" value={stats.totalTasks} />
        <StatCard icon={CircleCheck} tone="amber" label="Completed" value={stats.completedTasks} />
      </div>

      {/* Recent Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">Recent projects</h2>
            <Link to="/lecturer/projects" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.projectId}
                  to={`/lecturer/projects/${project.projectId}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-900">{project.title}</p>
                  <p className="text-sm text-gray-500">
                    {project.course} • {project.semester}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {project.teamCount || 0} teams • {project.status}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No projects created yet.</p>
          )}
        </div>

        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">Recent tasks</h2>
            <Link to="/lecturer/tasks" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <Link
                  key={task.taskId}
                  to={`/lecturer/tasks/${task.taskId}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.projectTitle} • {task.teamName || 'No team'} • {task.assignedToName || 'Unassigned'}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tasks created yet.</p>
          )}
        </div>
      </div>

      <DashboardProgress source="lecturer" basePath="/lecturer" />

      <UpcomingMeetings source="lecturer" basePath="/lecturer" />
    </div>
  );
};

export default LecturerDashboard;