import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import ProgressBar from './ProgressBar';
import ContributionTable from './ContributionTable';

const DashboardProgress = ({ source = 'my', basePath, showContributions = false }) => {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (source === 'lecturer') {
          const response = await progressApi.getLecturerProgress();
          setProjects((response.data || []).slice(0, 4));
        } else {
          const response = await progressApi.getMyProgress();
          setTeams((response.data || []).slice(0, 3));
        }
      } catch (error) {
        setTeams([]);
        setProjects([]);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [source]);

  if (!loaded) return null;

  if (source === 'lecturer') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Project progress</h2>
          <Link to={`${basePath}/progress`} className="text-sm text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects to summarize yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.projectId}
                to={`${basePath}/progress`}
                className="block rounded-xl border border-gray-100 p-4 hover:border-indigo-200 transition"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-gray-900">{project.projectTitle}</p>
                  <span className="text-sm font-semibold text-indigo-700">{project.taskPercent}%</span>
                </div>
                <ProgressBar percent={project.taskPercent} label="Tasks" hint={`${project.taskCompleted}/${project.taskTotal} tasks • ${project.teamCount} teams`} />
                {project.overdueTeamCount > 0 && (
                  <p className="text-xs text-red-600 mt-2">{project.overdueTeamCount} team(s) have overdue tasks</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team progress</h2>
        <Link to={`${basePath}/progress`} className="text-sm text-indigo-600 hover:text-indigo-700">
          View all →
        </Link>
      </div>
      {teams.length === 0 ? (
        <p className="text-gray-500 text-sm">No team progress yet.</p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <Link
              key={team.teamId}
              to={`${basePath}/progress?teamId=${team.teamId}`}
              className="block rounded-xl border border-gray-100 p-4 hover:border-indigo-200 transition"
            >
              <p className="font-medium text-gray-900">{team.teamName}</p>
              <p className="text-xs text-gray-500 mb-2">{team.projectTitle}</p>
              <ProgressBar
                percent={team.taskPercent}
                label="Tasks"
                hint={`${team.taskCompleted}/${team.taskTotal} tasks${typeof team.myCompleted === 'number' ? ` • you ${team.myCompleted}/${team.myAssigned}` : ''}`}
              />
            </Link>
          ))}
          {showContributions && teams[0]?.members?.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Contributions · {teams[0].teamName}
              </h3>
              <ContributionTable members={teams[0].members} compact />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardProgress;
