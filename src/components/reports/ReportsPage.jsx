import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import reportApi from '../../api/reportApi';
import teamApi from '../../api/teamApi';
import progressApi from '../../api/progressApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import {
  REPORT_TYPES,
  defaultWeeklyRange,
  toApiDateTime,
  reportToCsv,
  downloadCsv,
  reportBasePath,
  formatReportDate,
  reportFilename,
} from './reportUtils';

const ReportsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLecturer = reportBasePath() === '/lecturer';

  const [loadingScope, setLoadingScope] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [report, setReport] = useState(null);

  const [type, setType] = useState(searchParams.get('type') || 'PROGRESS');
  const [teamId, setTeamId] = useState(searchParams.get('teamId') || '');
  const [projectId, setProjectId] = useState(searchParams.get('projectId') || '');
  const [range, setRange] = useState(defaultWeeklyRange());

  useEffect(() => {
    loadScope();
  }, []);

  const loadScope = async () => {
    try {
      setLoadingScope(true);
      if (isLecturer) {
        const response = await progressApi.getLecturerProgress();
        const data = response.data || [];
        setProjects(data);
        setProjectId((current) => {
          if (current && data.some((project) => String(project.projectId) === String(current))) {
            return String(current);
          }
          const owner = data.find((project) =>
            (project.teams || []).some((team) => String(team.teamId) === String(teamId))
          );
          if (owner) return String(owner.projectId);
          return data[0] ? String(data[0].projectId) : '';
        });
      } else {
        const response = await teamApi.getMyTeams();
        const data = response.data || [];
        setTeams(data);
        setTeamId((current) => {
          if (current && data.some((team) => String(team.teamId) === String(current))) {
            return String(current);
          }
          return data[0] ? String(data[0].teamId) : '';
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load report options');
      setTeams([]);
      setProjects([]);
    } finally {
      setLoadingScope(false);
    }
  };

  const lecturerTeams = useMemo(() => {
    if (!isLecturer) return [];
    const project = projects.find((item) => String(item.projectId) === String(projectId));
    return project?.teams || [];
  }, [isLecturer, projects, projectId]);

  useEffect(() => {
    if (!isLecturer || loadingScope || !projectId) return;
    setTeamId((current) => {
      if (current && lecturerTeams.some((team) => String(team.teamId) === String(current))) {
        return String(current);
      }
      return '';
    });
  }, [isLecturer, loadingScope, projectId, lecturerTeams]);

  const syncParams = (next) => {
    const params = {};
    if (next.type) params.type = next.type;
    if (next.projectId) params.projectId = next.projectId;
    if (next.teamId) params.teamId = next.teamId;
    setSearchParams(params);
  };

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setReport(null);
    if (nextType === 'WEEKLY') {
      setRange(defaultWeeklyRange());
    }
    syncParams({ type: nextType, projectId, teamId });
  };

  const handleProjectChange = (nextProjectId) => {
    setProjectId(nextProjectId);
    setTeamId('');
    setReport(null);
    syncParams({ type, projectId: nextProjectId, teamId: '' });
  };

  const handleTeamChange = (nextTeamId) => {
    setTeamId(nextTeamId);
    setReport(null);
    syncParams({ type, projectId, teamId: nextTeamId });
  };

  const canGenerate = isLecturer ? Boolean(projectId || teamId) : Boolean(teamId);

  const generate = async () => {
    if (!canGenerate) {
      toast.error(isLecturer ? 'Select a project or team' : 'Select a team');
      return;
    }
    if (type === 'WEEKLY' && range.from && range.to && range.from > range.to) {
      toast.error('End date must be after start date');
      return;
    }
    try {
      setGenerating(true);
      const payload = { type };
      if (isLecturer && projectId) payload.projectId = projectId;
      if (teamId) payload.teamId = teamId;
      if (type === 'WEEKLY') {
        payload.from = toApiDateTime(range.from);
        payload.to = toApiDateTime(range.to);
      }
      const response = await reportApi.getReport(payload);
      setReport(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate report');
      setReport(null);
    } finally {
      setGenerating(false);
    }
  };

  const exportCsv = () => {
    if (!report) return;
    downloadCsv(reportFilename(report), reportToCsv(report));
  };

  if (loadingScope) return <LoadingSpinner text="Loading reports..." />;

  const empty = isLecturer ? projects.length === 0 : teams.length === 0;

  return (
    <div className="space-y-6">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">
          Preview a report on screen, download CSV, or use Print to save a PDF. Weekly reports cover the last 7 days unless you change the dates.
        </p>
      </div>

      {empty ? (
        <EmptyState
          title={isLecturer ? 'No supervised projects yet' : 'No team to report on'}
          description={
            isLecturer
              ? 'Create a project and teams, then you can export progress, tasks, contributions, and weekly activity.'
              : 'Join an active team to generate reports for that team only.'
          }
          icon="📄"
        />
      ) : (
        <>
          <div className="no-print bg-white rounded-xl shadow-sm p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Report type</p>
              <div className="flex flex-wrap gap-2">
                {REPORT_TYPES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      type === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isLecturer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectTitle} — {project.taskPercent}%
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isLecturer ? 'Team (optional)' : 'Team'}
                </label>
                <select
                  value={teamId}
                  onChange={(e) => handleTeamChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={isLecturer && !projectId}
                >
                  {isLecturer ? (
                    <option value="">All teams in this project</option>
                  ) : (
                    <option value="">Select a team</option>
                  )}
                  {(isLecturer ? lecturerTeams : teams).map((team) => (
                    <option key={team.teamId} value={team.teamId}>
                      {isLecturer
                        ? `${team.teamName} — ${team.taskPercent}%`
                        : `${team.name}${team.projectTitle ? ` (${team.projectTitle})` : ''}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {type === 'WEEKLY' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="datetime-local"
                    value={range.from}
                    onChange={(e) => setRange((current) => ({ ...current, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <input
                    type="datetime-local"
                    value={range.to}
                    onChange={(e) => setRange((current) => ({ ...current, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={generating || !canGenerate}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate preview'}
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={!report}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={!report}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          {generating && <LoadingSpinner text="Generating report..." />}

          {!generating && report && <ReportPreview report={report} />}
        </>
      )}
    </div>
  );
};

const ReportPreview = ({ report }) => (
  <div className="print-report bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
      <p className="text-sm text-gray-500 mt-1">
        Generated {formatReportDate(report.generatedAt)}
        {report.projectTitle ? ` • ${report.projectTitle}` : ''}
        {report.teamName ? ` • ${report.teamName}` : ''}
      </p>
      {(report.periodStart || report.periodEnd) && (
        <p className="text-sm text-gray-500">
          Period: {formatReportDate(report.periodStart)} – {formatReportDate(report.periodEnd)}
        </p>
      )}
    </div>

    {(report.metrics || []).length > 0 && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {report.metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">{metric.label}</p>
            <p className="text-lg font-bold text-gray-900 break-words">{metric.value}</p>
          </div>
        ))}
      </div>
    )}

    {(report.sections || []).map((section) => (
      <div key={section.title}>
        <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                {(section.columns || []).map((column) => (
                  <th key={column} className="py-2 pr-4 font-medium">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(section.rows || []).length === 0 ? (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={Math.max((section.columns || []).length, 1)}>
                    None in this report.
                  </td>
                </tr>
              ) : (
                section.rows.map((row, index) => (
                  <tr key={`${section.title}-${index}`} className="border-b border-gray-100">
                    {(row || []).map((cell, cellIndex) => (
                      <td key={`${section.title}-${index}-${cellIndex}`} className="py-2 pr-4 text-gray-800">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

export default ReportsPage;
