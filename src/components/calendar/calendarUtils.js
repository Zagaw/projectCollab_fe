export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const EVENT_TYPES = {
  meeting: {
    id: 'meeting',
    label: 'Meeting',
    chip: 'bg-sky-100 text-sky-800',
    soft: 'bg-sky-50 border-sky-200',
    dot: 'bg-sky-500',
    text: 'text-sky-700',
  },
  task: {
    id: 'task',
    label: 'Task deadline',
    chip: 'bg-amber-100 text-amber-800',
    soft: 'bg-amber-50 border-amber-100',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
  milestone: {
    id: 'milestone',
    label: 'Milestone',
    chip: 'bg-emerald-100 text-emerald-800',
    soft: 'bg-emerald-50 border-emerald-100',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
};

export const parseDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toDateKey = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isSameDay = (a, b) => toDateKey(a) === toDateKey(b);

export const isToday = (value) => isSameDay(value, new Date());

export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date, amount) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const buildMonthCells = (viewDate) => {
  const first = startOfMonth(viewDate);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), first.getDate() - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const cell = new Date(start);
    cell.setDate(start.getDate() + index);
    return cell;
  });
};

export const formatMonthYear = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const formatDayHeading = (date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export const formatCompactTime = (value) => {
  const date = parseDate(value);
  if (!date) return '';
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

export const formatDueLabel = (value) => {
  const date = parseDate(value);
  if (!date) return 'Due';
  if (date.getHours() === 0 && date.getMinutes() === 0) return 'Due';
  return `Due ${formatCompactTime(date)}`;
};

export const calendarBasePath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes('/teamleader')) return '/teamleader';
  return '/student';
};

const byTime = (a, b) => {
  const left = parseDate(a.at)?.getTime() || 0;
  const right = parseDate(b.at)?.getTime() || 0;
  return left - right;
};

export const buildCalendarEvents = ({ meetings = [], tasks = [], milestones = [], basePath }) => {
  const now = new Date();
  const events = [];

  meetings.forEach((meeting) => {
    if (!meeting?.meetingId || meeting.status === 'CANCELLED') return;
    const at = parseDate(meeting.startAt);
    if (!at) return;
    events.push({
      id: `meeting-${meeting.meetingId}`,
      entityId: meeting.meetingId,
      type: 'meeting',
      title: meeting.title,
      at: meeting.startAt,
      endAt: meeting.endAt,
      dateKey: toDateKey(at),
      timeLabel: `${formatCompactTime(meeting.startAt)}${meeting.endAt ? ` – ${formatCompactTime(meeting.endAt)}` : ''}`,
      teamName: meeting.teamName,
      projectTitle: meeting.projectTitle,
      status: meeting.status,
      done: meeting.status === 'COMPLETED',
      overdue: meeting.status === 'SCHEDULED' && parseDate(meeting.endAt) < now,
      href: `${basePath}/meetings/${meeting.meetingId}`,
    });
  });

  tasks.forEach((task) => {
    if (!task?.taskId || !task.deadline) return;
    const at = parseDate(task.deadline);
    if (!at) return;
    const done = task.status === 'COMPLETED';
    events.push({
      id: `task-${task.taskId}`,
      entityId: task.taskId,
      type: 'task',
      title: task.title,
      at: task.deadline,
      dateKey: toDateKey(at),
      timeLabel: formatDueLabel(task.deadline),
      teamName: task.teamName,
      projectTitle: task.projectTitle,
      status: task.status,
      done,
      overdue: !done && at < now,
      href: `${basePath}/tasks/${task.taskId}`,
    });
  });

  milestones.forEach((milestone) => {
    if (!milestone?.milestoneId || !milestone.deadline) return;
    const at = parseDate(milestone.deadline);
    if (!at) return;
    const done = Boolean(milestone.isCompleted);
    events.push({
      id: `milestone-${milestone.milestoneId}`,
      entityId: milestone.milestoneId,
      type: 'milestone',
      title: milestone.title,
      at: milestone.deadline,
      dateKey: toDateKey(at),
      timeLabel: formatDueLabel(milestone.deadline),
      teamName: milestone.teamName,
      projectTitle: milestone.projectTitle,
      status: done ? 'COMPLETED' : 'IN_PROGRESS',
      done,
      overdue: !done && at < now,
      href: `${basePath}/milestones/${milestone.milestoneId}`,
    });
  });

  return events.sort(byTime);
};

export const groupEventsByDate = (events) => {
  const map = {};
  events.forEach((event) => {
    if (!event.dateKey) return;
    if (!map[event.dateKey]) map[event.dateKey] = [];
    map[event.dateKey].push(event);
  });
  Object.values(map).forEach((list) => list.sort(byTime));
  return map;
};
