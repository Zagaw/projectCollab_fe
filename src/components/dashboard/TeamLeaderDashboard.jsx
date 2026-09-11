import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import taskApi from '../../api/taskApi';
import milestoneApi from '../../api/milestoneApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ActivityTimeline from '../activity/ActivityTimeline';
import UpcomingMeetings from '../meetings/UpcomingMeetings';
import DashboardProgress from '../progress/DashboardProgress';
import NeedsAttentionCard from '../insights/NeedsAttentionCard';
import { PageHeader, StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, Flag, AlertTriangle, Plus, CalendarPlus } from 'lucide-react';
import { dashboardGreeting } from '../../utils/userDisplay';

const TeamLeaderDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMembers: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [recentTeams, setRecentTeams] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all teams where user is team leader
      const teamsRes = await teamApi.getMyTeams();
      const teams = teamsRes.data || [];
      
      // Calculate team stats
      let totalMembers = 0;
      teams.forEach(team => {
        totalMembers += team.totalMembers || 0;
      });
      
      // Get milestones and tasks for all teams
      let allMilestones = [];
      let allTasks = [];
      
      for (const team of teams) {
        try {
          const milestonesRes = await milestoneApi.getMilestonesByTeam(team.teamId);
          const milestones = milestonesRes.data || [];
          allMilestones = [...allMilestones, ...milestones];
          
          const tasksRes = await taskApi.getTasksByTeam(team.teamId);
          const tasks = tasksRes.data || [];
          allTasks = [...allTasks, ...tasks];
        } catch (e) {
          // Skip teams without milestones/tasks
        }
      }
      
      const completedMilestones = allMilestones.filter(m => m.isCompleted).length;
      const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;
      const overdueTasks = allTasks.filter(t => 
        t.status !== 'COMPLETED' && 
        t.deadline && new Date(t.deadline) < new Date()
      ).length;
      
      setStats({
        totalTeams: teams.length,
        totalMembers: totalMembers,
        totalMilestones: allMilestones.length,
        completedMilestones: completedMilestones,
        totalTasks: allTasks.length,
        completedTasks: completedTasks,
        overdueTasks: overdueTasks
      });
      
      setRecentTeams(teams.slice(0, 3));
      setRecentTasks(allTasks.slice(0, 5));
      
      // Get upcoming milestones (next 3 deadlines)
      const upcoming = allMilestones
        .filter(m => !m.isCompleted)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);
      setUpcomingMilestones(upcoming);
      
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
        description={`Leading ${stats.totalTeams} team${stats.totalTeams === 1 ? '' : 's'} with ${stats.totalMembers} members.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/teamleader/tasks/create" className="btn-primary"><Plus className="w-4 h-4" strokeWidth={2} />Create task</Link>
            <Link to="/teamleader/milestones/create" className="btn-secondary">
              Create milestone
            </Link>
            <Link to="/teamleader/meetings/create" className="btn-secondary">
              <CalendarPlus className="w-4 h-4" strokeWidth={2} />
              Schedule meeting
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Teams" value={stats.totalTeams} />
        <StatCard icon={Users} tone="sky" label="Members" value={stats.totalMembers} />
        <StatCard icon={Flag} tone="sand" label="Milestones" value={`${stats.completedMilestones}/${stats.totalMilestones}`} />
        <StatCard icon={AlertTriangle} label="Overdue tasks" value={stats.overdueTasks} warn={stats.overdueTasks > 0} />
      </div>

      <NeedsAttentionCard source="my" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams Section */}
        <div className="lg:col-span-1">
          <div className="surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ink">Your teams</h2>
              <Link to="/teamleader/teams" className="text-sm text-indigo-600 hover:text-indigo-700">
                View all →
              </Link>
            </div>
            {recentTeams.length > 0 ? (
              <div className="space-y-3">
                {recentTeams.map((team) => (
                  <Link
                    key={team.teamId}
                    to={`/teamleader/teams/${team.teamId}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-900">{team.name}</p>
                    <p className="text-sm text-gray-500">{team.projectTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {team.totalMembers || 0} members • {team.activeMembers || 0} active
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No teams assigned yet.</p>
            )}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="lg:col-span-2">
          <div className="surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ink">Upcoming milestones</h2>
              <Link to="/teamleader/calendar" className="text-sm text-indigo-600 hover:text-indigo-700">
                View calendar →
              </Link>
            </div>
            {upcomingMilestones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingMilestones.map((milestone) => (
                  <Link
                    key={milestone.milestoneId}
                    to={`/teamleader/milestones/${milestone.milestoneId}`}
                    className="block p-4 border rounded-lg hover:border-indigo-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{milestone.title}</p>
                        <p className="text-sm text-gray-500">{milestone.teamName}</p>
                      </div>
                      <span className="text-xs text-red-500 font-medium">
                        {new Date(milestone.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        {milestone.isCompleted ? 'Completed' : 'Open'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming milestones.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Recent tasks</h2>
          <Link to="/teamleader/tasks" className="text-sm text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        {recentTasks.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>Task</th>
                  <th>Team</th>
                  <th>Assigned to</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.taskId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-3">
                      <Link to={`/teamleader/tasks/${task.taskId}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                        {task.title}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">{task.teamName || '-'}</td>
                    <td className="py-3 px-3 text-sm text-gray-600">{task.assignedToName || 'Unassigned'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        task.status === 'BLOCKED' ? 'bg-red-100 text-red-700' :
                        task.status === 'REVIEW' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status === 'COMPLETED' ? 'Done' :
                         task.status === 'IN_PROGRESS' ? 'In progress' :
                         task.status === 'BLOCKED' ? 'Blocked' :
                         task.status === 'REVIEW' ? 'Review' :
                         'To do'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                      {task.deadline && new Date(task.deadline) < new Date() && task.status !== 'COMPLETED' && (
                        <span className="ml-1 text-red-600 text-xs font-medium">Overdue</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tasks created yet.</p>
        )}
      </div>

      <DashboardProgress source="my" basePath="/teamleader" showContributions />

      <UpcomingMeetings source="my" basePath="/teamleader" />

      <div className="surface p-5">
        <h2 className="text-lg font-semibold text-ink mb-4">Recent activity</h2>
        <ActivityTimeline limit={8} compact />
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;