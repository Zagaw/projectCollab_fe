import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import insightApi from '../../api/insightApi';
import { IconWell } from '../common/PageHeader';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { bandClass, bandLabel, bandTone, insightBasePath } from './insightUtils';

const NeedsAttentionCard = ({ source = 'my' }) => {
  const basePath = insightBasePath();
  const [loading, setLoading] = useState(true);
  const [overdueCount, setOverdueCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        if (source === 'lecturer') {
          const response = await insightApi.getLecturer();
          const list = response.data || [];
          if (!cancelled) {
            setTeams(list.filter((team) => team.band === 'AT_RISK' || team.band === 'WATCH').slice(0, 3));
            setOverdueCount(list.reduce((sum, team) => sum + (team.overdueTaskCount || 0), 0));
            setDueSoonCount(list.reduce((sum, team) => sum + (team.dueSoonTaskCount || 0), 0));
          }
        } else {
          const response = await insightApi.getMine();
          const data = response.data || {};
          if (!cancelled) {
            setOverdueCount((data.myOverdue || []).length);
            setDueSoonCount((data.myDueSoon || []).length);
            setTeams((data.teams || []).filter((team) => team.band !== 'HEALTHY').slice(0, 3));
          }
        }
      } catch {
        if (!cancelled) {
          setTeams([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (loading || (overdueCount === 0 && dueSoonCount === 0 && teams.length === 0)) {
    return null;
  }

  const topBand = teams[0]?.band || (overdueCount > 0 ? 'AT_RISK' : 'WATCH');

  return (
    <section className="surface p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <IconWell tone={bandTone(topBand)}>
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} aria-hidden />
          </IconWell>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink">Needs attention</h2>
            <p className="text-sm text-gray-600">
              {overdueCount} overdue{source === 'lecturer' ? ' tasks across teams' : ''}
              {dueSoonCount > 0 ? ` · ${dueSoonCount} due within 48 hours` : ''}
            </p>
          </div>
        </div>
        <Link to={`${basePath}/insights`} className="text-sm font-medium text-indigo-700 hover:text-indigo-800 shrink-0">
          Open Insights →
        </Link>
      </div>

      {teams.length > 0 ? (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li key={team.teamId}>
              <Link
                to={`${basePath}/insights?teamId=${team.teamId}`}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ink truncate">{team.teamName}</span>
                  <span className="block text-xs text-gray-500 truncate">{team.projectTitle}</span>
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${bandClass(team.band)}`}>
                  {bandLabel(team.band)} · {team.score}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-700" strokeWidth={1.75} aria-hidden />
          You have deadline items to review in Insights.
        </p>
      )}
    </section>
  );
};

export default NeedsAttentionCard;
