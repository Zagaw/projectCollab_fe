import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import projectApi from '../../api/projectApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const isOverdueMilestone = (milestone) =>
  !milestone.isCompleted && milestone.deadline && new Date(milestone.deadline) < new Date();

const LecturerMilestoneMonitor = () => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [milestoneRes, projectRes] = await Promise.all([
        milestoneApi.getLecturerMilestones(),
        projectApi.getMyProjects(),
      ]);
      setMilestones(milestoneRes.data || []);
      setProjects(projectRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load milestones');
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  const teams = useMemo(() => {
    const source = projectId === 'ALL'
      ? milestones
      : milestones.filter((m) => String(m.projectId) === String(projectId));
    const map = {};
    source.forEach((m) => {
      if (m.teamId && !map[m.teamId]) {
        map[m.teamId] = { teamId: m.teamId, name: m.teamName, projectTitle: m.projectTitle };
      }
    });
    return Object.values(map);
  }, [milestones, projectId]);

  const filtered = useMemo(() => {
    return milestones.filter((m) => {
      if (projectId !== 'ALL' && String(m.projectId) !== String(projectId)) return false;
      if (teamId !== 'ALL' && String(m.teamId) !== String(teamId)) return false;
      if (status === 'COMPLETED') return m.isCompleted;
      if (status === 'IN_PROGRESS') return !m.isCompleted && !isOverdueMilestone(m);
      if (status === 'OVERDUE') return isOverdueMilestone(m);
      return true;
    });
  }, [milestones, projectId, teamId, status]);

  const stats = {
    total: filtered.length,
    completed: filtered.filter((m) => m.isCompleted).length,
    overdue: filtered.filter(isOverdueMilestone).length,
  };
  stats.inProgress = stats.total - stats.completed;

  const teamProgress = useMemo(() => {
    const map = {};
    filtered.forEach((m) => {
      const key = m.teamId || 'none';
      if (!map[key]) {
        map[key] = {
          teamId: m.teamId,
          name: m.teamName || 'No team',
          projectTitle: m.projectTitle,
          total: 0,
          completed: 0,
          overdue: 0,
        };
      }
      map[key].total += 1;
      if (m.isCompleted) map[key].completed += 1;
      if (isOverdueMilestone(m)) map[key].overdue += 1;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((m) => {
      const key = `${m.projectTitle || 'Project'}:::${m.teamName || 'Team'}`;
      if (!map[key]) map[key] = [];
      map[key].push(m);
    });
    return Object.entries(map);
  }, [filtered]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Milestone monitoring</h1>
        <p className="text-gray-600 mt-1">
          Compare milestone progress across every team in your projects. Open a card to see the tasks behind it.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500">Milestones</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-500">In progress</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-3">
        <select
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setTeamId('ALL');
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
        >
          <option value="ALL">All projects</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>{project.title}</option>
          ))}
        </select>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
        >
          <option value="ALL">All teams</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.name}{projectId === 'ALL' && team.projectTitle ? ` (${team.projectTitle})` : ''}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                status === item ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item === 'IN_PROGRESS' ? 'In progress' : item.charAt(0) + item.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {teamProgress.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Team progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {teamProgress.map((team) => {
              const pct = team.total ? Math.round((team.completed / team.total) * 100) : 0;
              return (
                <button
                  key={team.teamId || team.name}
                  type="button"
                  onClick={() => setTeamId(String(team.teamId))}
                  className="text-left bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition border border-gray-100"
                >
                  <p className="font-medium text-gray-900">{team.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{team.projectTitle}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {team.completed}/{team.total} complete
                    {team.overdue > 0 ? ` • ${team.overdue} overdue` : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No milestones to monitor"
          description="When team leaders create milestones, they will appear here grouped by team so you can compare progress."
          icon="🎯"
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, items]) => {
            const [projectTitle, teamName] = key.split(':::');
            return (
              <section key={key}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {teamName}
                  <span className="text-sm font-normal text-gray-500 ml-2">{projectTitle}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((milestone) => (
                    <MilestoneCard
                      key={milestone.milestoneId}
                      milestone={milestone}
                      showActions={false}
                      onViewDetails={(id) => navigate(`/lecturer/milestones/${id}`)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LecturerMilestoneMonitor;
