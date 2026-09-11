import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, StatCard, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';

const isOverdueTask = (task) =>
  task.status !== 'COMPLETED' && task.deadline && new Date(task.deadline) < new Date();

const LecturerTaskMonitor = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
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
      const [taskRes, projectRes] = await Promise.all([
        taskApi.getLecturerTasks(),
        projectApi.getMyProjects(),
      ]);
      setTasks(taskRes.data || []);
      setProjects(projectRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const teams = useMemo(() => {
    const source = projectId === 'ALL'
      ? tasks
      : tasks.filter((t) => String(t.projectId) === String(projectId));
    const map = {};
    source.forEach((t) => {
      if (t.teamId && !map[t.teamId]) {
        map[t.teamId] = { teamId: t.teamId, name: t.teamName, projectTitle: t.projectTitle };
      }
    });
    return Object.values(map);
  }, [tasks, projectId]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (projectId !== 'ALL' && String(t.projectId) !== String(projectId)) return false;
      if (teamId !== 'ALL' && String(t.teamId) !== String(teamId)) return false;
      if (status === 'OVERDUE') return isOverdueTask(t);
      if (status !== 'ALL') return t.status === status;
      return true;
    });
  }, [tasks, projectId, teamId, status]);

  const counts = {
    ALL: filtered.length,
    TODO: filtered.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: filtered.filter((t) => t.status === 'IN_PROGRESS').length,
    REVIEW: filtered.filter((t) => t.status === 'REVIEW').length,
    BLOCKED: filtered.filter((t) => t.status === 'BLOCKED').length,
    COMPLETED: filtered.filter((t) => t.status === 'COMPLETED').length,
    OVERDUE: filtered.filter(isOverdueTask).length,
  };

  const teamProgress = useMemo(() => {
    const map = {};
    const base = tasks.filter((t) =>
      projectId === 'ALL' || String(t.projectId) === String(projectId)
    );
    base.forEach((t) => {
      const key = t.teamId || 'none';
      if (!map[key]) {
        map[key] = {
          teamId: t.teamId,
          name: t.teamName || 'Unassigned team',
          projectTitle: t.projectTitle,
          total: 0,
          completed: 0,
          overdue: 0,
          blocked: 0,
        };
      }
      map[key].total += 1;
      if (t.status === 'COMPLETED') map[key].completed += 1;
      if (t.status === 'BLOCKED') map[key].blocked += 1;
      if (isOverdueTask(t)) map[key].overdue += 1;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks, projectId]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      const key = `${t.projectTitle || 'Project'}:::${t.teamName || 'No team'}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return Object.entries(map);
  }, [filtered]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task monitoring"
        description="Review every team's tasks in your projects. Filter, then open a task to read comments and files."
        actions={
          <Link to="/lecturer/tasks/create" className="btn-primary">
            Create task
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Tasks" value={counts.ALL} />
        <StatCard label="In progress / review" value={counts.IN_PROGRESS + counts.REVIEW} />
        <StatCard label="Completed" value={counts.COMPLETED} />
        <StatCard label="Overdue / blocked" value={counts.OVERDUE + counts.BLOCKED} warn={counts.OVERDUE + counts.BLOCKED > 0} />
      </div>

      <div className="surface p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="monitor-project">Project</label>
            <select
              id="monitor-project"
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
            <label className="label" htmlFor="monitor-team">Team</label>
            <select
              id="monitor-team"
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
            { id: 'TODO', label: 'To do', count: counts.TODO },
            { id: 'IN_PROGRESS', label: 'In progress', count: counts.IN_PROGRESS },
            { id: 'REVIEW', label: 'Review', count: counts.REVIEW },
            { id: 'BLOCKED', label: 'Blocked', count: counts.BLOCKED },
            { id: 'COMPLETED', label: 'Done', count: counts.COMPLETED },
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
                    {team.completed}/{team.total} done
                    {team.overdue > 0 ? ` · ${team.overdue} overdue` : ''}
                    {team.blocked > 0 ? ` · ${team.blocked} blocked` : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks to monitor"
          description="Tasks created for teams in your projects will show up here so you can compare progress without joining the team."
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      showActions={false}
                      detailsTo={`/lecturer/tasks/${task.taskId}`}
                      onViewDetails={(id) => navigate(`/lecturer/tasks/${id}`)}
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

export default LecturerTaskMonitor;
