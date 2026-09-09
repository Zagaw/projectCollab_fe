import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
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
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task monitoring</h1>
          <p className="text-gray-600 mt-1">
            See every team's tasks in your projects. Filter by project or team, then open a task to review comments and files.
          </p>
        </div>
        <Link
          to="/lecturer/tasks/create"
          className="self-start px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          Create task
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500">Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{counts.ALL}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500">In progress / review</p>
          <p className="text-2xl font-bold text-blue-600">{counts.IN_PROGRESS + counts.REVIEW}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{counts.COMPLETED}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500">Overdue / blocked</p>
          <p className="text-2xl font-bold text-red-600">{counts.OVERDUE + counts.BLOCKED}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
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
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'COMPLETED', 'OVERDUE'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                status === item ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.replace('_', ' ')}
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
                    {team.completed}/{team.total} done
                    {team.overdue > 0 ? ` • ${team.overdue} overdue` : ''}
                    {team.blocked > 0 ? ` • ${team.blocked} blocked` : ''}
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
          icon="✅"
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((task) => {
                    const overdue = isOverdueTask(task);
                    return (
                      <div
                        key={task.taskId}
                        className={`bg-white rounded-xl shadow-sm border p-5 ${
                          task.status === 'COMPLETED' ? 'border-green-200' :
                          overdue ? 'border-red-200' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <TaskPriorityBadge priority={task.priority} />
                        </div>
                        {task.assignedToName && (
                          <p className="text-xs text-gray-500 mb-2">Assigned to {task.assignedToName}</p>
                        )}
                        {task.milestoneTitle && (
                          <p className="text-xs text-gray-500 mb-2">Milestone: {task.milestoneTitle}</p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                            {overdue ? ' • overdue' : ''}
                          </span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/lecturer/tasks/${task.taskId}`)}
                          className="mt-3 w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                        >
                          View details
                        </button>
                      </div>
                    );
                  })}
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
