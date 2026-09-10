import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ProgressBar from './ProgressBar';
import TeamProgressPanel from './TeamProgressPanel';
import toast from 'react-hot-toast';

const LecturerProgressMonitor = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await progressApi.getLecturerProgress();
      setProjects(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load progress');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const teams = useMemo(() => {
    const source = projectId === 'ALL'
      ? projects.flatMap((project) => project.teams || [])
      : (projects.find((p) => String(p.projectId) === String(projectId))?.teams || []);
    return source;
  }, [projects, projectId]);

  const selectedProject = projectId === 'ALL'
    ? null
    : projects.find((p) => String(p.projectId) === String(projectId));

  const selectedTeam = teamId === 'ALL'
    ? null
    : teams.find((t) => String(t.teamId) === String(teamId));

  const overdueTeams = projects.reduce((sum, project) => sum + (project.overdueTeamCount || 0), 0);
  const avgPercent = projects.length
    ? Math.round(projects.reduce((sum, project) => sum + (project.taskPercent || 0), 0) / projects.length)
    : 0;

  if (loading) return <LoadingSpinner text="Loading progress..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-600 mt-1">
          Compare task completion across projects and teams. Open a team to see member contributions ranked by tasks completed.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500">Projects</p>
          <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500">Average completion</p>
          <p className="text-2xl font-bold text-blue-600">{avgPercent}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500">Teams</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.reduce((sum, project) => sum + (project.teamCount || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500">Teams with overdue tasks</p>
          <p className="text-2xl font-bold text-red-600">{overdueTeams}</p>
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
            <option key={project.projectId} value={project.projectId}>
              {project.projectTitle} — {project.taskPercent}%
            </option>
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
              {team.teamName}{projectId === 'ALL' && team.projectTitle ? ` (${team.projectTitle})` : ''} — {team.taskPercent}%
            </option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No project progress yet"
          description="Create a project and teams, then students will generate progress as they complete tasks."
          icon="📈"
        />
      ) : selectedTeam ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedTeam.teamName}</h2>
              <p className="text-sm text-gray-500">{selectedTeam.projectTitle}</p>
            </div>
            <Link
              to={`/lecturer/reports?projectId=${selectedTeam.projectId}&teamId=${selectedTeam.teamId}&type=PROGRESS`}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Open in Reports →
            </Link>
          </div>
          <TeamProgressPanel progress={selectedTeam} />
        </div>
      ) : (
        <div className="space-y-4">
          {(selectedProject ? [selectedProject] : projects).map((project) => (
            <div key={project.projectId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{project.projectTitle}</h2>
                  <p className="text-sm text-gray-500">
                    {project.teamCount || 0} teams
                    {project.overdueTeamCount > 0 ? ` • ${project.overdueTeamCount} with overdue tasks` : ''}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/lecturer/projects/${project.projectId}`)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Open project →
                  </button>
                  <Link
                    to={`/lecturer/reports?projectId=${project.projectId}&type=PROGRESS`}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Open in Reports →
                  </Link>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <ProgressBar
                  percent={project.taskPercent}
                  color="indigo"
                  label="Task completion"
                  hint={`${project.taskCompleted} of ${project.taskTotal} tasks`}
                />
                <ProgressBar
                  percent={project.milestonePercent}
                  color="emerald"
                  label="Milestone completion"
                  hint={`${project.milestoneCompleted} of ${project.milestoneTotal} milestones`}
                />
              </div>
              {(project.teams || []).length === 0 ? (
                <p className="text-sm text-gray-500">No teams on this project.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.teams.map((team) => (
                    <button
                      key={team.teamId}
                      type="button"
                      onClick={() => {
                        setProjectId(String(project.projectId));
                        setTeamId(String(team.teamId));
                      }}
                      className="text-left rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-gray-900">{team.teamName}</p>
                        <span className="text-sm font-semibold text-indigo-700">{team.taskPercent}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-indigo-600" style={{ width: `${team.taskPercent || 0}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {team.taskCompleted}/{team.taskTotal} tasks
                        {team.taskOverdue > 0 ? ` • ${team.taskOverdue} overdue` : ''}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LecturerProgressMonitor;
