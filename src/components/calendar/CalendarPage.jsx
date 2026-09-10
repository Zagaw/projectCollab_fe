import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import taskApi from '../../api/taskApi';
import milestoneApi from '../../api/milestoneApi';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  EVENT_TYPES,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  addMonths,
  buildCalendarEvents,
  buildMonthCells,
  calendarBasePath,
  formatDayHeading,
  formatMonthYear,
  groupEventsByDate,
  isSameDay,
  isToday,
  startOfMonth,
  toDateKey,
} from './calendarUtils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'task', label: 'Tasks' },
  { id: 'milestone', label: 'Milestones' },
];

const eventStyle = (event) => {
  if (event.overdue) {
    return {
      chip: 'bg-red-100 text-red-800',
      dot: 'bg-red-500',
      soft: 'bg-red-50 border-red-100',
      text: 'text-red-700',
    };
  }
  return EVENT_TYPES[event.type];
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const basePath = calendarBasePath();
  const isTeamLeader = basePath === '/teamleader';

  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [filter, setFilter] = useState('all');
  const [hideDone, setHideDone] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [meetingsRes, teamsRes, myTasksRes] = await Promise.all([
        meetingApi.getMyMeetings('all').catch(() => ({ data: [] })),
        teamApi.getMyTeams().catch(() => ({ data: [] })),
        taskApi.getMyTasks().catch(() => ({ data: [] })),
      ]);

      const teams = teamsRes.data || [];
      let tasks = myTasksRes.data || [];

      if (isTeamLeader && teams.length > 0) {
        const teamTaskResults = await Promise.all(
          teams.map((team) => taskApi.getTasksByTeam(team.teamId).catch(() => ({ data: [] })))
        );
        const unique = {};
        teamTaskResults.forEach((result) => {
          (result.data || []).forEach((task) => {
            unique[task.taskId] = task;
          });
        });
        tasks = Object.values(unique);
      }

      const milestoneResults = await Promise.all(
        teams.map((team) => milestoneApi.getMilestonesByTeam(team.teamId).catch(() => ({ data: [] })))
      );
      const milestones = {};
      milestoneResults.forEach((result) => {
        (result.data || []).forEach((milestone) => {
          milestones[milestone.milestoneId] = milestone;
        });
      });

      setEvents(buildCalendarEvents({
        meetings: meetingsRes.data || [],
        tasks,
        milestones: Object.values(milestones),
        basePath,
      }));
    } catch (error) {
      toast.error('Failed to load calendar');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      if (filter !== 'all' && event.type !== filter) return false;
      if (hideDone && event.done) return false;
      return true;
    });
  }, [events, filter, hideDone]);

  const eventsByDate = useMemo(() => groupEventsByDate(visibleEvents), [visibleEvents]);
  const cells = useMemo(() => buildMonthCells(viewDate), [viewDate]);
  const selectedKey = toDateKey(selectedDate);
  const selectedEvents = eventsByDate[selectedKey] || [];

  const monthEvents = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    return visibleEvents.filter((event) => {
      const date = new Date(event.at);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [visibleEvents, viewDate]);

  const upcoming = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return visibleEvents
      .filter((event) => !event.done && new Date(event.at) >= start)
      .slice(0, 8);
  }, [visibleEvents]);

  const overdue = useMemo(
    () => visibleEvents.filter((event) => event.overdue && !event.done),
    [visibleEvents]
  );

  const monthCounts = {
    meeting: monthEvents.filter((event) => event.type === 'meeting').length,
    task: monthEvents.filter((event) => event.type === 'task').length,
    milestone: monthEvents.filter((event) => event.type === 'milestone').length,
  };

  const selectDay = (date) => {
    setSelectedDate(date);
    if (date.getMonth() !== viewDate.getMonth() || date.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(startOfMonth(date));
    }
  };

  const goToday = () => {
    const now = new Date();
    setViewDate(startOfMonth(now));
    setSelectedDate(now);
  };

  if (loading) return <LoadingSpinner text="Loading calendar..." />;

  return (
    <div className="space-y-5 min-w-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">
            {isTeamLeader
              ? 'Team meetings, task deadlines, and milestone due dates in one place.'
              : 'Your meetings, assigned task deadlines, and team milestone due dates.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDate((current) => addMonths(current, -1))}
            className="h-10 w-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="min-w-[160px] text-center text-lg font-semibold text-gray-900">
            {formatMonthYear(viewDate)}
          </h2>
          <button
            type="button"
            onClick={() => setViewDate((current) => addMonths(current, 1))}
            className="h-10 w-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Next month"
          >
            ›
          </button>
          <button
            type="button"
            onClick={goToday}
            className="h-10 px-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Meetings" count={monthCounts.meeting} color="border-indigo-500" />
        <StatCard label="Task deadlines" count={monthCounts.task} color="border-amber-500" />
        <StatCard label="Milestones" count={monthCounts.milestone} color="border-emerald-500" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filter === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={hideDone}
            onChange={(e) => setHideDone(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Hide completed
        </label>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        {Object.values(EVENT_TYPES).map((type) => (
          <span key={type.id} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${type.dot}`} />
            {type.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Overdue
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className="px-1 py-2 text-center text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                <span className="sm:hidden">{WEEKDAYS_SHORT[index]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date) => {
              const key = toDateKey(date);
              const dayEvents = eventsByDate[key] || [];
              const outside = date.getMonth() !== viewDate.getMonth();
              const selected = isSameDay(date, selectedDate);
              const today = isToday(date);
              const hasOverdue = dayEvents.some((event) => event.overdue);

              return (
                <div
                  key={key}
                  onClick={() => selectDay(date)}
                  className={`min-h-[72px] sm:min-h-[108px] lg:min-h-[124px] p-1 sm:p-1.5 text-left border-b border-r border-gray-100 cursor-pointer transition ${
                    outside ? 'bg-gray-50/80' : 'bg-white'
                  } ${selected ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50/70' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <button
                      type="button"
                      onClick={() => selectDay(date)}
                      aria-current={today ? 'date' : undefined}
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        today
                          ? 'bg-indigo-600 text-white'
                          : outside
                            ? 'text-gray-400'
                            : 'text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                    {hasOverdue && (
                      <span className="hidden sm:inline h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => selectDay(date)}
                    className="sm:hidden w-full flex flex-wrap gap-0.5 min-h-[18px]"
                    aria-label={`Show items on ${date.getDate()}`}
                  >
                    {dayEvents.slice(0, 4).map((event) => (
                      <span key={event.id} className={`h-1.5 w-1.5 rounded-full ${eventStyle(event).dot}`} />
                    ))}
                  </button>
                  <div className="hidden sm:flex flex-col gap-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const style = eventStyle(event);
                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => navigate(event.href)}
                          className={`truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium text-left ${style.chip} ${event.done ? 'opacity-60 line-through' : ''} hover:brightness-95`}
                        >
                          {event.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <button
                        type="button"
                        onClick={() => selectDay(date)}
                        className="text-[11px] text-gray-500 px-1 text-left hover:text-indigo-600"
                      >
                        +{dayEvents.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900">{formatDayHeading(selectedDate)}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedEvents.length === 0
                ? 'Nothing scheduled this day.'
                : `${selectedEvents.length} item${selectedEvents.length === 1 ? '' : 's'}`}
            </p>
            <div className="mt-4 space-y-2">
              {selectedEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  Pick another day, or schedule a meeting from Meetings.
                </div>
              ) : (
                selectedEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onOpen={() => navigate(event.href)}
                  />
                ))
              )}
            </div>
          </section>

          {overdue.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-4 sm:p-5">
              <h3 className="font-semibold text-red-700">Overdue</h3>
              <div className="mt-3 space-y-2">
                {overdue.slice(0, 5).map((event) => (
                  <EventRow key={event.id} event={event} onOpen={() => navigate(event.href)} compact />
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900">Coming up</h3>
            <div className="mt-3 space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming items for this filter.</p>
              ) : (
                upcoming.map((event) => (
                  <EventRow key={event.id} event={event} onOpen={() => navigate(event.href)} compact showDate />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-3 sm:p-4 border-l-4 ${color}`}>
    <p className="text-[11px] sm:text-xs text-gray-500">{label}</p>
    <p className="text-xl sm:text-2xl font-bold text-gray-900">{count}</p>
  </div>
);

const EventRow = ({ event, onOpen, compact = false, showDate = false }) => {
  const style = eventStyle(event);
  const dateLabel = new Date(event.at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full text-left rounded-xl border p-3 hover:shadow-sm transition ${style.soft} ${event.done ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-medium text-gray-900 truncate ${event.done ? 'line-through' : ''}`}>
              {event.title}
            </p>
            <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${style.chip}`}>
              {EVENT_TYPES[event.type].label.split(' ')[0]}
            </span>
          </div>
          <p className={`text-xs mt-1 ${style.text}`}>
            {showDate ? `${dateLabel} • ${event.timeLabel}` : event.timeLabel}
            {event.overdue ? ' • Overdue' : ''}
          </p>
          {!compact && (event.teamName || event.projectTitle) && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {[event.teamName, event.projectTitle].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default CalendarPage;
