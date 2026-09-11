import React from 'react';
import ProgressBar from './ProgressBar';
import ContributionTable from './ContributionTable';
import { StatCard } from '../common/PageHeader';
import { ListTodo, TrendingUp, AlertTriangle, Flag } from 'lucide-react';

const TeamProgressPanel = ({ progress, compact = false, showTable = true }) => {
  if (!progress) return null;

  const noTasks = !progress.taskTotal;
  const noMilestones = !progress.milestoneTotal;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={ListTodo} label="Tasks" value={`${progress.taskCompleted}/${progress.taskTotal || 0}`} />
        <StatCard icon={TrendingUp} tone="sky" label="Task progress" value={`${progress.taskPercent || 0}%`} />
        <StatCard icon={AlertTriangle} label="Overdue tasks" value={progress.taskOverdue || 0} warn={progress.taskOverdue > 0} />
        <StatCard icon={Flag} tone="sand" label="Milestones" value={`${progress.milestoneCompleted}/${progress.milestoneTotal || 0}`} />
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
          color="indigo"
          label="Milestone completion"
          hint={noMilestones ? 'No milestones yet.' : `${progress.milestoneCompleted} of ${progress.milestoneTotal} milestones completed`}
        />
      </div>
      {typeof progress.myAssigned === 'number' && (
        <p className="text-sm text-gray-600">
          Your tasks: <span className="font-medium text-ink">{progress.myCompleted || 0}</span> completed
          of <span className="font-medium text-ink">{progress.myAssigned}</span> assigned
        </p>
      )}
      {showTable && (
        <div>
          <h3 className="font-semibold text-ink mb-3">Member contributions</h3>
          <ContributionTable members={progress.members} compact={compact} />
        </div>
      )}
    </div>
  );
};

export default TeamProgressPanel;
