import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import projectApi from '../../api/projectApi';
import MilestoneCard from './MilestoneCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, StatCard, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Flag, Timer, CircleCheck, AlertTriangle } from 'lucide-react';

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

  const scoped = useMemo(() => {
    return milestones.filter((m) => {
      if (projectId !== 'ALL' && String(m.projectId) !== String(projectId)) return false;
      if (teamId !== 'ALL' && String(m.teamId) !== String(teamId)) return false;
      return true;
    });
  }, [milestones, projectId, teamId]);

  const counts = {
    ALL: scoped.length,
    IN_PROGRESS: scoped.filter((m) => !m.isCompleted && !isOverdueMilestone(m)).length,
    COMPLETED: scoped.filter((m) => m.isCompleted).length,
    OVERDUE: scoped.filter(isOverdueMilestone).length,
  };

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
      <PageHeader
        icon={Flag}
        title="Milestone monitoring"
        description="Compare milestone progress across every team in your projects. Open a card to see the tasks behind it."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flag} label="Milestones" value={counts.ALL} />
        <StatCard icon={Timer} tone="sky" label="In progress" value={counts.IN_PROGRESS} />
        <StatCard icon={CircleCheck} tone="violet" label="Completed" value={counts.COMPLETED} />
        <StatCard icon={AlertTriangle} label="Overdue" value={counts.OVERDUE} warn={counts.OVERDUE > 0} />
      </div>

      <div className="surface p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="ms-monitor-project">Project</label>
            <select
              id="ms-monitor-project"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setTeamId('ALL');
              }}
              className="field"
            >
              <option value="ALL">All projects</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>{project.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ms-monitor-team">Team</label>
            <select
              id="ms-monitor-team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="field"
            >
              <option value="ALL">All teams</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.name}{projectId === 'ALL' && team.projectTitle ? ` (${team.projectTitle})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        <FilterChips
          value={status}
          onChange={setStatus}
          options={[
            { id: 'ALL', label: 'All', count: counts.ALL },
            { id: 'IN_PROGRESS', label: 'In progress', count: counts.IN_PROGRESS },
            { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
            { id: 'OVERDUE', label: 'Overdue', count: counts.OVERDUE },
          ]}
        />
      </div>

      {teamProgress.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ink mb-3">Team progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {teamProgress.map((team) => {
              const pct = team.total ? Math.round((team.completed / team.total) * 100) : 0;
              return (
                <button
                  key={team.teamId || team.name}
                  type="button"
                  onClick={() => team.teamId && setTeamId(String(team.teamId))}
                  className="text-left surface p-4 hover:border-indigo-200 transition"
                >
                  <p className="font-medium text-ink">{team.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{team.projectTitle}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {team.completed}/{team.total} complete
                    {team.overdue > 0 ? ` · ${team.overdue} overdue` : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No milestones to monitor"
          description="When team leaders create milestones, they will appear here grouped by team so you can compare progress."
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, items]) => {
            const [projectTitle, teamName] = key.split(':::');
            return (
              <section key={key}>
                <h2 className="text-lg font-semibold text-ink mb-3">
                  {teamName}
                  <span className="text-sm font-normal text-gray-500 ml-2">{projectTitle}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((milestone) => (
                    <MilestoneCard
                      key={milestone.milestoneId}
                      milestone={milestone}
                      showActions={false}
                      detailsTo={`/lecturer/milestones/${milestone.milestoneId}`}
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
