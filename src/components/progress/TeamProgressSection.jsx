import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import progressApi from '../../api/progressApi';
import TeamProgressPanel from './TeamProgressPanel';
import { reportBasePath } from '../reports/reportUtils';
import toast from 'react-hot-toast';

const TeamProgressSection = ({ teamId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!teamId) return;
    const load = async () => {
      try {
        const response = await progressApi.getTeamProgress(teamId);
        setProgress(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load team progress');
      }
    };
    load();
  }, [teamId]);

  if (!progress) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Progress and contributions</h3>
        <Link
          to={`${reportBasePath()}/reports?teamId=${teamId}&projectId=${progress.projectId || ''}&type=PROGRESS`}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Open in Reports →
        </Link>
      </div>
      <TeamProgressPanel progress={progress} />
    </div>
  );
};

export default TeamProgressSection;
