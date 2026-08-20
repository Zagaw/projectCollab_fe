import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    tasks: 0,
    projects: 0,
    deadlines: 0,
    notifications: 0
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, deadlinesRes, notificationsRes] = await Promise.all([
        api.get('/tasks/my-tasks'),
        api.get('/tasks/upcoming-deadlines'),
        api.get('/notifications/unread-count'),
      ]);

      setStats({
        tasks: tasksRes.data.length || 0,
        projects: 0,
        deadlines: deadlinesRes.data.length || 0,
        notifications: notificationsRes.data.count || 0
      });

      setRecentTasks(tasksRes.data.slice(0, 5));
      setUpcomingDeadlines(deadlinesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-[#191939] text-white';

      case 'MEDIUM':
        return 'bg-[#ECB44D] text-[#191939]';

      default:
        return 'bg-[#6FB8E6] text-[#191939]';
    }
  };

  if (loading) {
    return (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#6FB8E6]/30 border-t-[#1B3A68] rounded-full animate-spin"></div>
            <div className="absolute text-[#ECB44D] text-xl">✦</div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#eef3f8] p-4 md:p-6 lg:p-8">

        <div className="max-w-[1500px] mx-auto">

          {/* TOP HEADER */}

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B3A68] via-[#244a7c] to-[#191939] p-6 md:p-8 mb-6 shadow-[0_20px_50px_rgba(27,58,104,0.25)]">

            {/* Decorative Stars */}

            <div className="absolute top-5 left-[35%] text-[#FEF199] text-lg animate-pulse">
              ✦
            </div>

            <div className="absolute top-10 right-10 text-[#6FB8E6] text-xl">
              ✧
            </div>

            <div className="absolute bottom-6 right-[25%] text-[#ECB44D]">
              ✦
            </div>

            <div className="absolute bottom-10 left-[45%] text-[#FEF199] text-sm">
              ✧
            </div>

            {/* Background Circle */}

            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-[35px] border-[#6FB8E6]/10"></div>

            <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#191939]/20"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              {/* Welcome */}

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-2xl bg-[#FEF199] flex items-center justify-center shadow-lg">
                  <span className="text-[#1B3A68] text-xl">
                    ✦
                  </span>
                  </div>

                  <div>
                    <p className="text-[#FEF199] text-xs tracking-[0.25em] font-bold">
                      STUDENT DASHBOARD
                    </p>

                    <p className="text-white/60 text-xs mt-1">
                      Collabora Workspace
                    </p>
                  </div>

                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Welcome back,
                  <span className="text-[#6FB8E6]">
                  {' '}{user?.firstName || 'Student'}
                </span>
                  <span className="text-[#FEF199]"> ✦</span>
                </h1>

                <p className="text-white/70 mt-4 text-sm md:text-base max-w-xl">
                  Here's what's happening with your projects today.
                  Stay organized, track your progress, and keep creating something amazing.
                </p>

              </div>


              {/* Mini Profile */}

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 min-w-[220px]">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF199] to-[#ECB44D] flex items-center justify-center text-[#1B3A68] text-xl font-bold shadow-lg">
                    {user?.firstName?.charAt(0) || 'S'}
                  </div>

                  <div>

                    <p className="text-white font-semibold">
                      {user?.firstName || 'Student'} {user?.lastName || ''}
                    </p>

                    <p className="text-[#6FB8E6] text-xs mt-1">
                      Ready to collaborate
                    </p>

                    <div className="flex items-center gap-2 mt-3">

                      <span className="w-2 h-2 rounded-full bg-[#FEF199] animate-pulse"></span>

                      <span className="text-white/60 text-xs">
                      Active now
                    </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* MAIN DASHBOARD GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">


            {/* LEFT SIDE */}

            <div className="xl:col-span-8 space-y-6">


              {/* OVERVIEW */}

              <div className="bg-white rounded-[2rem] p-6 md:p-7 shadow-[0_15px_40px_rgba(27,58,104,0.08)] border border-[#1B3A68]/5">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">
                      OVERVIEW
                    </p>

                    <h2 className="text-2xl font-bold text-[#1B3A68] mt-1">
                      Your Workspace
                    </h2>

                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#1B3A68] flex items-center justify-center text-[#FEF199] shadow-md">
                    ✦
                  </div>

                </div>


                {/* Stats */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


                  {/* Tasks */}

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3A68] to-[#244a7c] p-5 min-h-[170px] shadow-lg">

                    <div className="absolute right-3 top-2 text-[#6FB8E6]/30 text-5xl">
                      ✓
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#6FB8E6]/20 flex items-center justify-center text-[#FEF199]">
                      ✓
                    </div>

                    <p className="text-white/60 text-xs mt-5">
                      TOTAL TASKS
                    </p>

                    <p className="text-4xl font-bold text-white mt-1">
                      {stats.tasks}
                    </p>

                    <Link
                        to="/tasks"
                        className="inline-block text-[#FEF199] text-xs font-semibold mt-4 hover:text-white transition"
                    >
                      View tasks →
                    </Link>

                  </div>


                  {/* Projects */}

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6FB8E6] to-[#8cccf0] p-5 min-h-[170px] shadow-lg">

                    <div className="absolute right-3 top-2 text-white/30 text-5xl">
                      ▣
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center text-[#1B3A68]">
                      ▣
                    </div>

                    <p className="text-[#1B3A68]/70 text-xs mt-5">
                      PROJECTS
                    </p>

                    <p className="text-4xl font-bold text-[#1B3A68] mt-1">
                      {stats.projects}
                    </p>

                    <Link
                        to="/projects"
                        className="inline-block text-[#1B3A68] text-xs font-bold mt-4 hover:text-white transition"
                    >
                      View projects →
                    </Link>

                  </div>


                  {/* Deadlines */}

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ECB44D] to-[#f5c96c] p-5 min-h-[170px] shadow-lg">

                    <div className="absolute right-3 top-2 text-white/30 text-5xl">
                      ◷
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center text-[#1B3A68]">
                      ◷
                    </div>

                    <p className="text-[#1B3A68]/70 text-xs mt-5">
                      DEADLINES
                    </p>

                    <p className="text-4xl font-bold text-[#1B3A68] mt-1">
                      {stats.deadlines}
                    </p>

                    <Link
                        to="/tasks?filter=deadlines"
                        className="inline-block text-[#1B3A68] text-xs font-bold mt-4 hover:text-white transition"
                    >
                      View deadlines →
                    </Link>

                  </div>


                  {/* Notifications */}

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#191939] to-[#303060] p-5 min-h-[170px] shadow-lg">

                    <div className="absolute right-3 top-2 text-[#6FB8E6]/20 text-5xl">
                      ♧
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#6FB8E6]/15 flex items-center justify-center text-[#FEF199]">
                      ●
                    </div>

                    <p className="text-white/60 text-xs mt-5">
                      NOTIFICATIONS
                    </p>

                    <p className="text-4xl font-bold text-white mt-1">
                      {stats.notifications}
                    </p>

                    <Link
                        to="/notifications"
                        className="inline-block text-[#6FB8E6] text-xs font-bold mt-4 hover:text-[#FEF199] transition"
                    >
                      View notifications →
                    </Link>

                  </div>

                </div>

              </div>


              {/* RECENT TASKS */}

              <div className="bg-white rounded-[2rem] p-6 md:p-7 shadow-[0_15px_40px_rgba(27,58,104,0.08)]">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">
                      RECENT ACTIVITY
                    </p>

                    <h2 className="text-2xl font-bold text-[#1B3A68] mt-1">
                      Your Recent Tasks
                    </h2>

                  </div>

                  <Link
                      to="/tasks"
                      className="w-10 h-10 rounded-xl bg-[#1B3A68] text-[#FEF199] flex items-center justify-center hover:bg-[#244a7c] hover:shadow-lg transition"
                  >
                    →
                  </Link>

                </div>


                {recentTasks.length > 0 ? (

                    <div className="space-y-3">

                      {recentTasks.map((task, index) => (

                          <div
                              key={task.id}
                              className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#f7f9fc] border border-transparent hover:border-[#6FB8E6]/40 hover:bg-white hover:shadow-md transition-all duration-300"
                          >

                            <div className="flex items-center gap-4 min-w-0">

                              <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center font-bold ${
                                  index % 3 === 0
                                      ? 'bg-[#1B3A68] text-[#FEF199]'
                                      : index % 3 === 1
                                          ? 'bg-[#6FB8E6] text-[#1B3A68]'
                                          : 'bg-[#ECB44D] text-[#1B3A68]'
                              }`}>
                                {index + 1}
                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-[#1B3A68] truncate">
                                  {task.title}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  Due: {new Date(task.deadline).toLocaleDateString()}
                                </p>

                              </div>

                            </div>


                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide flex-shrink-0 ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>

                          </div>

                      ))}

                    </div>

                ) : (

                    <div className="py-10 text-center rounded-3xl bg-[#f7f9fc]">

                      <div className="text-4xl text-[#ECB44D]">
                        ✦
                      </div>

                      <p className="text-[#1B3A68] font-semibold mt-3">
                        No tasks assigned yet
                      </p>

                      <p className="text-slate-400 text-sm mt-1">
                        Your upcoming tasks will appear here.
                      </p>

                    </div>

                )}

              </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="xl:col-span-4 space-y-6">


              {/* UPCOMING DEADLINES */}

              <div className="relative overflow-hidden rounded-[2rem] bg-[#1B3A68] p-6 shadow-[0_20px_45px_rgba(27,58,104,0.22)]">

                <div className="absolute top-3 right-6 text-[#FEF199] text-lg">
                  ✦
                </div>

                <div className="absolute bottom-5 left-5 text-[#6FB8E6] text-sm">
                  ✧
                </div>

                <div className="relative z-10">

                  <div className="flex items-center justify-between mb-6">

                    <div>

                      <p className="text-[#FEF199] text-xs tracking-[0.18em] font-bold">
                        STAY ON TRACK
                      </p>

                      <h2 className="text-2xl font-bold text-white mt-2">
                        Upcoming Deadlines
                      </h2>

                    </div>

                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FEF199]">
                      ◷
                    </div>

                  </div>


                  {upcomingDeadlines.length > 0 ? (

                      <div className="space-y-3">

                        {upcomingDeadlines.map((task, index) => (

                            <div
                                key={task.id}
                                className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition"
                            >

                              <div className="flex gap-3">

                                <div className={`w-2 rounded-full ${
                                    index === 0
                                        ? 'bg-[#FEF199]'
                                        : index === 1
                                            ? 'bg-[#6FB8E6]'
                                            : 'bg-[#ECB44D]'
                                }`}>
                                </div>

                                <div className="flex-1 min-w-0">

                                  <p className="text-white text-sm font-semibold truncate">
                                    {task.title}
                                  </p>

                                  <p className="text-white/50 text-xs mt-1 truncate">
                                    {task.projectName}
                                  </p>

                                  <div className="flex justify-between items-center mt-3">

                              <span className="text-[#FEF199] text-xs">
                                {new Date(task.deadline).toLocaleDateString()}
                              </span>

                                    <span className="text-[#6FB8E6] text-xs font-semibold">
                                {task.daysLeft} days left
                              </span>

                                  </div>

                                </div>

                              </div>

                            </div>

                        ))}

                      </div>

                  ) : (

                      <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/10">

                        <div className="text-[#FEF199] text-4xl">
                          ✧
                        </div>

                        <p className="text-white font-medium mt-3">
                          No upcoming deadlines
                        </p>

                        <p className="text-white/50 text-xs mt-2">
                          Enjoy your free schedule!
                        </p>

                      </div>

                  )}


                  <Link
                      to="/tasks?filter=deadlines"
                      className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FEF199] text-[#1B3A68] font-bold text-sm hover:bg-white hover:shadow-[0_0_25px_rgba(254,241,153,0.45)] transition-all duration-300"
                  >
                    View all deadlines
                    <span>→</span>
                  </Link>

                </div>

              </div>


              {/* QUICK ACTION */}

              <div className="rounded-[2rem] bg-white p-6 shadow-[0_15px_40px_rgba(27,58,104,0.08)]">

                <p className="text-xs tracking-[0.18em] text-[#ECB44D] font-bold">
                  QUICK ACCESS
                </p>

                <h2 className="text-xl font-bold text-[#1B3A68] mt-2 mb-5">
                  Explore Workspace
                </h2>


                <div className="grid grid-cols-2 gap-3">

                  <Link
                      to="/projects"
                      className="group p-4 rounded-2xl bg-[#6FB8E6]/15 hover:bg-[#6FB8E6] transition-all duration-300"
                  >

                    <div className="text-[#1B3A68] group-hover:text-white text-xl transition">
                      ▣
                    </div>

                    <p className="text-[#1B3A68] group-hover:text-white font-semibold text-sm mt-3 transition">
                      Projects
                    </p>

                  </Link>


                  <Link
                      to="/tasks"
                      className="group p-4 rounded-2xl bg-[#ECB44D]/15 hover:bg-[#ECB44D] transition-all duration-300"
                  >

                    <div className="text-[#1B3A68] text-xl">
                      ✓
                    </div>

                    <p className="text-[#1B3A68] font-semibold text-sm mt-3">
                      Tasks
                    </p>

                  </Link>


                  <Link
                      to="/notifications"
                      className="group p-4 rounded-2xl bg-[#1B3A68]/10 hover:bg-[#1B3A68] transition-all duration-300"
                  >

                    <div className="text-[#1B3A68] group-hover:text-[#FEF199] text-xl transition">
                      ●
                    </div>

                    <p className="text-[#1B3A68] group-hover:text-white font-semibold text-sm mt-3 transition">
                      Alerts
                    </p>

                  </Link>


                  <Link
                      to="/dashboard"
                      className="group p-4 rounded-2xl bg-[#FEF199]/40 hover:bg-[#FEF199] transition-all duration-300"
                  >

                    <div className="text-[#1B3A68] text-xl">
                      ✦
                    </div>

                    <p className="text-[#1B3A68] font-semibold text-sm mt-3">
                      Overview
                    </p>

                  </Link>

                </div>

              </div>


              {/* MOTIVATION CARD */}

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6FB8E6] to-[#1B3A68] p-6">

                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border-[25px] border-white/10"></div>

                <div className="relative z-10">

                <span className="text-[#FEF199] text-2xl">
                  ✦
                </span>

                  <p className="text-white text-lg font-semibold mt-3 leading-relaxed">
                    Small progress every day leads to something big.
                  </p>

                  <p className="text-white/60 text-xs mt-4">
                    Keep creating. Keep collaborating.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <div className="flex items-center justify-center gap-3 mt-8 pb-4 text-xs text-[#1B3A68]/60">

            <span className="text-[#ECB44D]">✦</span>

            <span>COLLABORATE</span>

            <span className="w-1 h-1 rounded-full bg-[#6FB8E6]"></span>

            <span>CREATE</span>

            <span className="w-1 h-1 rounded-full bg-[#ECB44D]"></span>

            <span>CONNECT</span>

            <span className="text-[#6FB8E6]">✧</span>

          </div>

        </div>

      </div>
  );
};

export default StudentDashboard;