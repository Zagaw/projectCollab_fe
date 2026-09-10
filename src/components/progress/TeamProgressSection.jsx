import React, { useEffect, useState } from 'react';
import progressApi from '../../api/progressApi';
import TeamProgressPanel from './TeamProgressPanel';
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
      <h3 className="font-semibold text-gray-900 mb-4">Progress and contributions</h3>
      <TeamProgressPanel progress={progress} />
    </div>
  );
};

export default TeamProgressSection;
