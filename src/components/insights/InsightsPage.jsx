import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import insightApi from '../../api/insightApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, IconWell, StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import {
  Sparkles,
  AlertTriangle,
  Timer,
  ShieldCheck,
  Flag,
  ListTodo,
  ArrowRight,
  ScanSearch,
} from 'lucide-react';
import {
  bandClass,
  bandLabel,
  bandTone,
  formatDeadline,
  insightBasePath,
  itemHref,
} from './insightUtils';

const InsightsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const basePath = insightBasePath();
  const isLecturer = user?.role === 'LECTURER' || user?.role === 'ADMIN';

  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [myOverdue, setMyOverdue] = useState([]);
  const [myDueSoon, setMyDueSoon] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get('teamId') || '');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summarySource, setSummarySource] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [scanning, setScanning] = useState(false);

  const loadOverview = async () => {
    setLoading(true);
    try {
      if (isLecturer) {
        const response = await insightApi.getLecturer();
        setTeams(response.data || []);
        setMyOverdue([]);
        setMyDueSoon([]);
      } else {
        const response = await insightApi.getMine();
        const data = response.data || {};
        setTeams(data.teams || []);
        setMyOverdue(data.myOverdue || []);
        setMyDueSoon(data.myDueSoon || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load insights');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [isLecturer]);

  useEffect(() => {
    const fromQuery = searchParams.get('teamId');
    if (fromQuery) {
      setSelectedId(fromQuery);
      return;
    }
    if (teams.length && !selectedId) {
      setSelectedId(String(teams[0].teamId));
    }
  }, [teams, searchParams]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      setSummary(null);
      return;
    }
    let cancelled = false;
    const loadDetail = async () => {
      try {
        setDetailLoading(true);
        setSummary(null);
        const response = await insightApi.getTeam(selectedId);
        if (!cancelled) setDetail(response.data);
      } catch (error) {
        if (!cancelled) {
          setDetail(null);
          toast.error(error.response?.data?.error || 'Failed to load team insight');
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const counts = useMemo(() => ({
    atRisk: teams.filter((team) => team.band === 'AT_RISK').length,
    watch: teams.filter((team) => team.band === 'WATCH').length,
    healthy: teams.filter((team) => team.band === 'HEALTHY').length,
  }), [teams]);

  const handleSelect = (teamId) => {
    const value = String(teamId);
    setSelectedId(value);
    setSearchParams({ teamId: value });
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      const response = await insightApi.scan();
      const created = response.data?.notificationsCreated ?? 0;
      toast.success(created === 0 ? 'Scan complete. No new reminders.' : `Scan sent ${created} reminder${created === 1 ? '' : 's'}.`);
      await loadOverview();
      if (selectedId) {
        const detailRes = await insightApi.getTeam(selectedId);
        setDetail(detailRes.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to run scan');
    } finally {
      setScanning(false);
    }
  };

  const handleSummary = async () => {
    if (!selectedId) return;
    try {
      setSummarizing(true);
      const response = await insightApi.summarizeTeam(selectedId);
      setSummary(response.data?.summary || '');
      setSummarySource(response.data?.source || '');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate summary');
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading insights..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Sparkles}
        title="Insights"
        description="Deadline risk scores, upcoming work, and recommended actions for your teams."
        actions={isLecturer ? (
          <button type="button" className="btn-primary" onClick={handleScan} disabled={scanning}>
            <ScanSearch className="w-4 h-4" strokeWidth={2} aria-hidden />
            {scanning ? 'Scanning…' : 'Scan now'}
          </button>
        ) : null}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="At risk teams" value={counts.atRisk} warn={counts.atRisk > 0} />
        <StatCard icon={Timer} tone="sand" label="Watch" value={counts.watch} />
        <StatCard icon={ShieldCheck} tone="teal" label="Healthy" value={counts.healthy} />
        {!isLecturer && (
          <StatCard icon={ListTodo} tone="sky" label="My overdue" value={myOverdue.length} warn={myOverdue.length > 0} />
        )}
        {isLecturer && (
          <StatCard icon={Flag} tone="sky" label="Teams" value={teams.length} />
        )}
      </div>

      {!isLecturer && (myOverdue.length > 0 || myDueSoon.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ItemList title="My overdue work" items={myOverdue} basePath={basePath} empty="No overdue tasks assigned to you." />
          <ItemList title="Due within 48 hours" items={myDueSoon} basePath={basePath} empty="Nothing due in the next 48 hours." />
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No team insights yet"
          description={isLecturer
            ? 'Create a project team with tasks and milestones to see deadline risk scores.'
            : 'Join a team to see its deadline risk score and upcoming work.'}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {teams.map((team) => {
              const active = String(team.teamId) === String(selectedId);
              return (
                <button
                  key={team.teamId}
                  type="button"
                  onClick={() => handleSelect(team.teamId)}
                  className={`w-full text-left surface p-4 transition ${active ? 'border-indigo-300 ring-1 ring-indigo-200' : 'hover:border-indigo-200'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate">{team.teamName}</p>
                      <p className="text-xs text-gray-500 truncate">{team.projectTitle}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${bandClass(team.band)}`}>
                      {bandLabel(team.band)} · {team.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {(team.reasons || [])[0]}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2 surface p-5">
            {detailLoading || !detail ? (
              <LoadingSpinner text="Loading team insight..." />
            ) : (
              <TeamInsightDetail
                detail={detail}
                basePath={basePath}
                summary={summary}
                summarySource={summarySource}
                summarizing={summarizing}
                onSummarize={handleSummary}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TeamInsightDetail = ({ detail, basePath, summary, summarySource, summarizing, onSummarize }) => (
  <div className="space-y-5">
    <div className="flex items-start gap-3">
      <IconWell tone={bandTone(detail.band)}>
        <Sparkles className="w-5 h-5" strokeWidth={1.75} aria-hidden />
      </IconWell>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-ink">{detail.teamName}</h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bandClass(detail.band)}`}>
            {bandLabel(detail.band)} · {detail.score}
          </span>
        </div>
        <p className="text-sm text-gray-600">{detail.projectTitle}</p>
      </div>
      <Link to={`${basePath}/teams/${detail.teamId}`} className="text-sm font-medium text-indigo-700 hover:text-indigo-800 shrink-0">
        View team
      </Link>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {(detail.reasons || []).map((reason, index) => (
        <span key={`${index}-${reason}`} className="px-2 py-1 rounded-md bg-gray-50 text-sm text-gray-700">
          {reason}
        </span>
      ))}
    </div>

    <div>
      <button type="button" className="btn-secondary" onClick={onSummarize} disabled={summarizing}>
        <Sparkles className="w-4 h-4" strokeWidth={2} aria-hidden />
        {summarizing ? 'Generating…' : 'Generate summary'}
      </button>
      {summary && (
        <div className="mt-3 p-4 rounded-xl bg-indigo-50 text-sm text-indigo-950">
          <p>{summary}</p>
          {summarySource && (
            <p className="text-xs text-indigo-800/70 mt-2">
              {summarySource === 'LLM' ? 'Written from the risk score by AI.' : 'Written from the risk score (template).'}
            </p>
          )}
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ItemList title="Overdue" items={detail.overdueItems || []} basePath={basePath} empty="No overdue items." embedded />
      <ItemList title="Due within 48 hours" items={detail.dueSoonItems || []} basePath={basePath} empty="Nothing due soon." embedded />
    </div>
  </div>
);

const ItemList = ({ title, items, basePath, empty, embedded = false }) => (
  <div className={embedded ? '' : 'surface p-4'}>
    <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
    {items.length === 0 ? (
      <p className="text-sm text-gray-500">{empty}</p>
    ) : (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.entityType}-${item.entityId}`}>
            <Link
              to={itemHref(item, basePath)}
              className="flex items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="min-w-0">
                <span className="block font-medium text-ink truncate">{item.title}</span>
                <span className="block text-xs text-gray-500">
                  {item.entityType === 'MILESTONE' ? 'Milestone' : 'Task'} · {formatDeadline(item.deadline)}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default InsightsPage;
