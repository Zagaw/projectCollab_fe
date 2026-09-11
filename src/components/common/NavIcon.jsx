import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Mail,
  ListTodo,
  Flag,
  MessageSquare,
  Files,
  Video,
  Calendar,
  TrendingUp,
  FileBarChart,
  Clock,
  Sparkles,
} from 'lucide-react';

const icons = {
  home: LayoutDashboard,
  folder: FolderKanban,
  users: Users,
  mail: Mail,
  check: ListTodo,
  flag: Flag,
  chat: MessageSquare,
  paperclip: Files,
  video: Video,
  calendar: Calendar,
  chart: TrendingUp,
  doc: FileBarChart,
  clock: Clock,
  spark: Sparkles,
};

const NavIcon = ({ name, className = 'w-5 h-5' }) => {
  const Icon = icons[name] || LayoutDashboard;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
};

export default NavIcon;
