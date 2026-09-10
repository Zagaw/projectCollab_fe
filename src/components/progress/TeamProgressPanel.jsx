import React from 'react';
import ProgressBar from './ProgressBar';
import ContributionTable from './ContributionTable';

const TeamProgressPanel = ({ progress, compact = false, showTable = true }) => {
  if (!progress) return null;

  const noTasks = !progress.taskTotal;
  const noMilestones = !progress.milestoneTotal;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Tasks" value={`${progress.taskCompleted}/${progress.taskTotal || 0}`} />
        <Stat label="Task progress" value={`${progress.taskPercent || 0}%`} />
        <Stat label="Overdue tasks" value={progress.taskOverdue || 0} warn={progress.taskOverdue > 0} />
        <Stat label="Milestones" value={`${progress.milestoneCompleted}/${progress.milestoneTotal || 0}`} />
      </div>
      <div className="space-y-4">
        <ProgressBar
          percent={progress.taskPercent}
          color="indigo"
          label="Task completion"
          hint={noTasks ? 'No tasks yet.' : `${progress.taskCompleted} of ${progress.taskTotal} tasks completed`}
        />
        <ProgressBar
          percent={progress.milestonePercent}
          color="emerald"
          label="Milestone completion"
          hint={noMilestones ? 'No milestones yet.' : `${progress.milestoneCompleted} of ${progress.milestoneTotal} milestones completed`}
        />
      </div>
      {typeof progress.myAssigned === 'number' && (
        <p className="text-sm text-gray-600">
          Your tasks: <span className="font-medium text-gray-900">{progress.myCompleted || 0}</span> completed
          of <span className="font-medium text-gray-900">{progress.myAssigned}</span> assigned
        </p>
      )}
      {showTable && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Member contributions</h3>
          <ContributionTable members={progress.members} compact={compact} />
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, warn = false }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-lg font-bold ${warn ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
  </div>
);

export default TeamProgressPanel;
