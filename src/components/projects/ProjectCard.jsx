import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Users, CalendarRange, ArrowRight } from 'lucide-react';
import { IconWell } from '../common/PageHeader';

const ACCENTS = [
  { bar: 'bg-indigo-600', well: 'teal' },
  { bar: 'bg-sky-600', well: 'sky' },
  { bar: 'bg-sand', well: 'sand' },
];

const statusColors = {
  ACTIVE: 'bg-green-50 text-green-800',
  COMPLETED: 'bg-indigo-50 text-indigo-800',
  ON_HOLD: 'bg-amber-50 text-amber-800',
  CANCELLED: 'bg-red-50 text-red-700',
};

const statusLabel = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
  CANCELLED: 'Cancelled',
};

const ProjectCard = ({ project, onDelete, detailsTo, teamName }) => {
  const accent = ACCENTS[Math.abs(Number(project.projectId) || 0) % ACCENTS.length];
  const href = detailsTo || `/lecturer/projects/${project.projectId}`;
  const showTeamCount = typeof project.teamCount === 'number';

  return (
    <article className="surface p-5 flex flex-col overflow-hidden hover:border-indigo-200 transition">
      <div className={`h-1.5 -mx-5 -mt-5 mb-4 ${accent.bar}`} />

      <div className="flex items-start gap-3 mb-3">
        <IconWell tone={accent.well}>
          <FolderKanban className="w-5 h-5" strokeWidth={1.75} aria-hidden />
        </IconWell>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start gap-2">
            {project.status ? (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabel[project.status] || project.status}
              </span>
            ) : (
              <span />
            )}
            {project.createdAt && (
              <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-ink mt-1 line-clamp-1">{project.title}</h3>
        </div>
      </div>

      {teamName && (
        <p className="flex items-center gap-1.5 text-sm text-sky-800 mb-3">
          <Users className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Your team: {teamName}
        </p>
      )}

      {teamName ? (
        <div className="flex-1" />
      ) : (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {project.description || 'No description yet.'}
        </p>
      )}

      {(project.course || project.semester || showTeamCount) && (
        <div className="flex flex-wrap gap-1.5 text-sm mb-3">
          {project.course && (
            <span className="px-2 py-1 rounded-md bg-sky-50 text-sky-800">{project.course}</span>
          )}
          {project.semester && (
            <span className="px-2 py-1 rounded-md bg-sand-50 text-sand-800">{project.semester}</span>
          )}
          {showTeamCount && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-800">
              <Users className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              {project.teamCount} {project.teamCount === 1 ? 'team' : 'teams'}
            </span>
          )}
        </div>
      )}

      {(project.startDate || project.endDate) && (
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <CalendarRange className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}
          {' – '}
          {project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}
        </p>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
        <Link to={href} className="btn-primary flex-1">
          View details
          <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden />
        </Link>
        {onDelete && (
          <button type="button" onClick={() => onDelete(project.projectId)} className="btn-danger">
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
