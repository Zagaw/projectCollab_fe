import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import ProgressBar from './ProgressBar';

const ProjectProgressOverview = ({ projectId, basePath }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      try {
        const response = await progressApi.getProjectProgress(projectId);
        setProgress(response.data);
      } catch (error) {
        setProgress(null);
      }
    };
    load();
  }, [projectId]);

  if (!progress) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Progress</h3>
        <Link to={`${basePath}/progress`} className="text-sm text-indigo-600 hover:text-indigo-700">
          Details →
        </Link>
      </div>
      <div className="space-y-3">
        <ProgressBar
          percent={progress.taskPercent}
          color="indigo"
          label="Tasks"
          hint={`${progress.taskCompleted} of ${progress.taskTotal} tasks completed`}
        />
        <ProgressBar
          percent={progress.milestonePercent}
          color="emerald"
          label="Milestones"
          hint={`${progress.milestoneCompleted} of ${progress.milestoneTotal} milestones completed`}
        />
      </div>
      {(progress.teams || []).length > 0 && (
        <div className="mt-4 space-y-2">
          {progress.teams.map((team) => (
            <Link
              key={team.teamId}
              to={`${basePath}/teams/${team.teamId}`}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <span className="text-gray-800">{team.teamName}</span>
              <span className="font-medium text-indigo-700">{team.taskPercent}%</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectProgressOverview;
