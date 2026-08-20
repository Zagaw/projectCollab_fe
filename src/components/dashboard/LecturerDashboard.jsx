import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const LecturerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    delayedProjects: 0,
  });

  const [projects, setProjects] = useState([]);
  const [teamProgress, setTeamProgress] = useState([]);
  const [memberContributions, setMemberContributions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      /*
        Replace these with your real API endpoints when backend is ready.

        Example:
        const [
          projectsRes,
          progressRes,
          contributionsRes,
          activitiesRes
        ] = await Promise.all([
          api.get('/lecturer/projects'),
          api.get('/lecturer/team-progress'),
          api.get('/lecturer/member-contributions'),
          api.get('/lecturer/recent-activities')
        ]);
      */

      // Temporary sample data

      const sampleProjects = [
        {
          id: 1,
          name: 'Smart Campus Management System',
          team: 'Team Alpha',
          progress: 78,
          status: 'ACTIVE',
          deadline: '2026-09-15',
        },
        {
          id: 2,
          name: 'AI Transportation Monitoring',
          team: 'Team Nova',
          progress: 62,
          status: 'ACTIVE',
          deadline: '2026-09-22',
        },
        {
          id: 3,
          name: 'Online Learning Platform',
          team: 'Team Orbit',
          progress: 100,
          status: 'COMPLETED',
          deadline: '2026-08-10',
        },
        {
          id: 4,
          name: 'Student Collaboration Platform',
          team: 'Team Zenith',
          progress: 35,
          status: 'DELAYED',
          deadline: '2026-08-18',
        },
      ];

      const sampleContributions = [
        {
          id: 1,
          name: 'Aung Aung',
          role: 'Team Leader',
          contribution: 92,
          completedTasks: 18,
        },
        {
          id: 2,
          name: 'Su Su',
          role: 'Frontend Developer',
          contribution: 85,
          completedTasks: 15,
        },
        {
          id: 3,
          name: 'Kyaw Kyaw',
          role: 'Backend Developer',
          contribution: 76,
          completedTasks: 12,
        },
        {
          id: 4,
          name: 'Mya Mya',
          role: 'UI/UX Designer',
          contribution: 68,
          completedTasks: 10,
        },
      ];

      const sampleActivities = [
        {
          id: 1,
          title: 'Smart Campus project progress updated',
          team: 'Team Alpha',
          time: '10 minutes ago',
        },
        {
          id: 2,
          title: 'New task completed',
          team: 'Team Nova',
          time: '35 minutes ago',
        },
        {
          id: 3,
          title: 'Project milestone reached',
          team: 'Team Orbit',
          time: '2 hours ago',
        },
        {
          id: 4,
          title: 'Deadline approaching',
          team: 'Team Zenith',
          time: '4 hours ago',
        },
      ];

      setProjects(sampleProjects);
      setTeamProgress(sampleProjects);
      setMemberContributions(sampleContributions);
      setRecentActivities(sampleActivities);

      setStats({
        totalProjects: sampleProjects.length,
        activeProjects: sampleProjects.filter(
            (project) => project.status === 'ACTIVE'
        ).length,
        completedProjects: sampleProjects.filter(
            (project) => project.status === 'COMPLETED'
        ).length,
        delayedProjects: sampleProjects.filter(
            (project) => project.status === 'DELAYED'
        ).length,
      });
    } catch (error) {
      console.error('Error fetching lecturer dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[#6FB8E6]/20 text-[#1B3A68]';

      case 'DELAYED':
        return 'bg-[#ECB44D]/25 text-[#1B3A68]';

      case 'ACTIVE':
      default:
        return 'bg-[#1B3A68] text-white';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-[#6FB8E6]';
    if (progress >= 50) return 'bg-[#ECB44D]';
    return 'bg-[#1B3A68]';
  };

  if (loading) {
    return (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#6FB8E6]/30 border-t-[#1B3A68] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[#ECB44D]">
              ✦
            </div>
          </div>
        </div>
    );
  }

  const averageProgress =
      projects.length > 0
          ? Math.round(
              projects.reduce(
                  (total, project) => total + project.progress,
                  0
              ) / projects.length
          )
          : 0;

  const averageContribution =
      memberContributions.length > 0
          ? Math.round(
              memberContributions.reduce(
                  (total, member) => total + member.contribution,
                  0
              ) / memberContributions.length
          )
          : 0;

  return (
      <div className="min-h-screen bg-[#eef3f8] p-4 md:p-6 lg:p-8">
        <div className="max-w-[1500px] mx-auto">

          {/* ================= HEADER ================= */}

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B3A68] via-[#244a7c] to-[#191939] p-6 md:p-8 mb-6 shadow-[0_20px_50px_rgba(27,58,104,0.25)]">

            <div className="absolute top-6 left-[30%] text-[#FEF199] text-xl animate-pulse">
              ✦
            </div>

            <div className="absolute top-10 right-12 text-[#6FB8E6] text-2xl">
              ✧
            </div>

            <div className="absolute bottom-8 left-[55%] text-[#ECB44D]">
              ✦
            </div>

            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border-[35px] border-[#6FB8E6]/10" />

            <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-[#191939]/20" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 rounded-2xl bg-[#FEF199] flex items-center justify-center shadow-lg">
                  <span className="text-[#1B3A68] text-xl">
                    ✦
                  </span>
                  </div>

                  <div>
                    <p className="text-[#FEF199] text-xs tracking-[0.25em] font-bold">
                      LECTURER DASHBOARD
                    </p>

                    <p className="text-white/60 text-xs mt-1">
                      Project & Team Management
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Welcome back,
                  <span className="text-[#6FB8E6]">
                  {' '}{user?.firstName || 'Lecturer'}
                </span>
                  <span className="text-[#FEF199]"> ✦</span>
                </h1>

                <p className="text-white/70 mt-4 max-w-xl">
                  Monitor project performance, team progress, member
                  contributions, and overall academic collaboration.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 min-w-[230px]">

                <p className="text-[#FEF199] text-xs tracking-wider">
                  OVERALL PROGRESS
                </p>

                <div className="flex items-end gap-2 mt-3">
                <span className="text-5xl font-bold text-white">
                  {averageProgress}%
                </span>

                  <span className="text-[#6FB8E6] text-sm mb-2">
                  average
                </span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FEF199] to-[#6FB8E6]"
                      style={{ width: `${averageProgress}%` }}
                  />
                </div>

              </div>

            </div>
          </div>

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            <div className="relative overflow-hidden rounded-[1.8rem] bg-[#1B3A68] p-6 shadow-lg">

              <div className="absolute right-4 top-2 text-[#6FB8E6]/20 text-6xl">
                ▣
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#6FB8E6]/20 flex items-center justify-center text-[#FEF199]">
                ▣
              </div>

              <p className="text-white/60 text-xs mt-5 tracking-wider">
                TOTAL PROJECTS
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {stats.totalProjects}
              </p>

              <p className="text-[#6FB8E6] text-xs mt-3">
                All supervised projects
              </p>

            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] bg-[#6FB8E6] p-6 shadow-lg">

              <div className="absolute right-4 top-2 text-white/20 text-6xl">
                ↗
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-[#1B3A68]">
                ↗
              </div>

              <p className="text-[#1B3A68]/70 text-xs mt-5 tracking-wider">
                ACTIVE PROJECTS
              </p>

              <p className="text-4xl font-bold text-[#1B3A68] mt-2">
                {stats.activeProjects}
              </p>

              <p className="text-[#1B3A68]/70 text-xs mt-3">
                Currently in progress
              </p>

            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] bg-[#ECB44D] p-6 shadow-lg">

              <div className="absolute right-4 top-2 text-white/25 text-6xl">
                ✓
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-[#1B3A68]">
                ✓
              </div>

              <p className="text-[#1B3A68]/70 text-xs mt-5 tracking-wider">
                COMPLETED
              </p>

              <p className="text-4xl font-bold text-[#1B3A68] mt-2">
                {stats.completedProjects}
              </p>

              <p className="text-[#1B3A68]/70 text-xs mt-3">
                Successfully completed
              </p>

            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] bg-[#191939] p-6 shadow-lg">

              <div className="absolute right-4 top-2 text-[#ECB44D]/20 text-6xl">
                !
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#ECB44D]/20 flex items-center justify-center text-[#FEF199]">
                !
              </div>

              <p className="text-white/60 text-xs mt-5 tracking-wider">
                NEED ATTENTION
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                {stats.delayedProjects}
              </p>

              <p className="text-[#ECB44D] text-xs mt-3">
                Delayed or behind schedule
              </p>

            </div>

          </div>

          {/* ================= MAIN CONTENT ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* LEFT CONTENT */}

            <div className="xl:col-span-8 space-y-6">

              {/* TEAM PROGRESS */}

              <div className="bg-white rounded-[2rem] p-6 md:p-7 shadow-[0_15px_40px_rgba(27,58,104,0.08)]">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">
                      PROJECT MONITORING
                    </p>

                    <h2 className="text-2xl font-bold text-[#1B3A68] mt-1">
                      Team Progress
                    </h2>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#1B3A68] text-[#FEF199] flex items-center justify-center">
                    ↗
                  </div>

                </div>

                <div className="space-y-5">

                  {teamProgress.map((project) => (
                      <div
                          key={project.id}
                          className="p-5 rounded-3xl bg-[#f7f9fc] hover:bg-white hover:shadow-md border border-transparent hover:border-[#6FB8E6]/30 transition-all"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div>
                            <h3 className="font-bold text-[#1B3A68]">
                              {project.name}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {project.team}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">

                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(project.status)}`}>
                          {project.status}
                        </span>

                            <span className="text-lg font-bold text-[#1B3A68]">
                          {project.progress}%
                        </span>

                          </div>

                        </div>

                        <div className="w-full h-3 bg-[#1B3A68]/10 rounded-full mt-5 overflow-hidden">

                          <div
                              className={`h-full rounded-full ${getProgressColor(project.progress)}`}
                              style={{ width: `${project.progress}%` }}
                          />

                        </div>

                        <div className="flex justify-between mt-3 text-xs text-slate-500">

                      <span>
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                      </span>

                          <span className="text-[#1B3A68] font-semibold">
                        {project.progress}% completed
                      </span>

                        </div>

                      </div>
                  ))}

                </div>

              </div>

              {/* MEMBER CONTRIBUTIONS */}

              <div className="bg-white rounded-[2rem] p-6 md:p-7 shadow-[0_15px_40px_rgba(27,58,104,0.08)]">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#ECB44D] font-bold">
                      TEAM PERFORMANCE
                    </p>

                    <h2 className="text-2xl font-bold text-[#1B3A68] mt-1">
                      Member Contributions
                    </h2>
                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Average contribution
                    </p>

                    <p className="text-2xl font-bold text-[#1B3A68]">
                      {averageContribution}%
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {memberContributions.map((member, index) => (

                      <div
                          key={member.id}
                          className="rounded-3xl p-5 border border-[#1B3A68]/5 bg-[#f8fafc] hover:shadow-md transition"
                      >

                        <div className="flex items-center gap-4">

                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                              index % 4 === 0
                                  ? 'bg-[#1B3A68] text-[#FEF199]'
                                  : index % 4 === 1
                                      ? 'bg-[#6FB8E6] text-[#1B3A68]'
                                      : index % 4 === 2
                                          ? 'bg-[#ECB44D] text-[#1B3A68]'
                                          : 'bg-[#191939] text-white'
                          }`}>
                            {member.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-bold text-[#1B3A68]">
                              {member.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {member.role}
                            </p>
                          </div>

                        </div>

                        <div className="flex justify-between mt-5 mb-2">

                      <span className="text-xs text-slate-500">
                        Contribution
                      </span>

                          <span className="text-sm font-bold text-[#1B3A68]">
                        {member.contribution}%
                      </span>

                        </div>

                        <div className="h-2.5 rounded-full bg-[#1B3A68]/10 overflow-hidden">

                          <div
                              className={getProgressColor(member.contribution)}
                              style={{
                                width: `${member.contribution}%`,
                                height: '100%',
                                borderRadius: '999px',
                              }}
                          />

                        </div>

                        <p className="text-xs text-[#1B3A68]/70 mt-4">
                          {member.completedTasks} tasks completed
                        </p>

                      </div>

                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR */}

            <div className="xl:col-span-4 space-y-6">

              {/* ANALYTICS */}

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B3A68] via-[#244a7c] to-[#191939] p-6 shadow-[0_20px_45px_rgba(27,58,104,0.22)]">

                <div className="absolute top-5 right-6 text-[#FEF199]">
                  ✦
                </div>

                <div className="absolute bottom-6 left-6 text-[#6FB8E6]">
                  ✧
                </div>

                <div className="relative z-10">

                  <p className="text-[#FEF199] text-xs tracking-[0.2em] font-bold">
                    ANALYTICS
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-2">
                    Overall Performance
                  </h2>

                  <div className="mt-8 space-y-6">

                    <div>
                      <div className="flex justify-between text-sm mb-2">

                      <span className="text-white/70">
                        Project Completion
                      </span>

                        <span className="text-[#FEF199] font-bold">
                        {averageProgress}%
                      </span>

                      </div>

                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-[#FEF199] rounded-full"
                            style={{ width: `${averageProgress}%` }}
                        />

                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">

                      <span className="text-white/70">
                        Member Engagement
                      </span>

                        <span className="text-[#6FB8E6] font-bold">
                        {averageContribution}%
                      </span>

                      </div>

                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-[#6FB8E6] rounded-full"
                            style={{ width: `${averageContribution}%` }}
                        />

                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">

                      <span className="text-white/70">
                        Projects On Track
                      </span>

                        <span className="text-[#ECB44D] font-bold">
                        {stats.totalProjects > 0
                            ? Math.round(
                                ((stats.activeProjects +
                                        stats.completedProjects) /
                                    stats.totalProjects) *
                                100
                            )
                            : 0}
                          %
                      </span>

                      </div>

                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-[#ECB44D] rounded-full"
                            style={{
                              width: `${
                                  stats.totalProjects > 0
                                      ? Math.round(
                                          ((stats.activeProjects +
                                                  stats.completedProjects) /
                                              stats.totalProjects) *
                                          100
                                      )
                                      : 0
                              }%`,
                            }}
                        />

                      </div>
                    </div>

                  </div>

                  <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/10">

                    <p className="text-[#6FB8E6] text-xs">
                      Lecturer Insight
                    </p>

                    <p className="text-white text-sm mt-2 leading-relaxed">
                      Your teams are making steady progress. Review delayed
                      projects and members with lower contributions.
                    </p>

                  </div>

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div className="bg-white rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(27,58,104,0.08)]">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-xs tracking-[0.18em] text-[#ECB44D] font-bold">
                      LIVE UPDATES
                    </p>

                    <h2 className="text-xl font-bold text-[#1B3A68] mt-1">
                      Recent Activity
                    </h2>
                  </div>

                  <span className="w-3 h-3 rounded-full bg-[#6FB8E6] animate-pulse" />

                </div>

                <div className="space-y-5">

                  {recentActivities.map((activity, index) => (

                      <div
                          key={activity.id}
                          className="flex gap-4"
                      >

                        <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${
                            index % 3 === 0
                                ? 'bg-[#1B3A68] text-[#FEF199]'
                                : index % 3 === 1
                                    ? 'bg-[#6FB8E6] text-[#1B3A68]'
                                    : 'bg-[#ECB44D] text-[#1B3A68]'
                        }`}>
                          ✦
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#1B3A68]">
                            {activity.title}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {activity.team}
                          </p>

                          <p className="text-xs text-[#6FB8E6] mt-1">
                            {activity.time}
                          </p>

                        </div>

                      </div>

                  ))}

                </div>

              </div>

              {/* QUICK INSIGHT */}

              <div className="relative overflow-hidden rounded-[2rem] bg-[#FEF199] p-6">

                <div className="absolute -right-8 -bottom-8 text-[#1B3A68]/10 text-[150px]">
                  ✦
                </div>

                <div className="relative z-10">

                <span className="text-[#ECB44D] text-2xl">
                  ✦
                </span>

                  <h3 className="text-xl font-bold text-[#1B3A68] mt-3">
                    Teaching Insight
                  </h3>

                  <p className="text-[#1B3A68]/70 text-sm leading-relaxed mt-2">
                    Use contribution and progress data to identify which teams
                    need additional guidance and support.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="flex justify-center items-center gap-3 mt-8 pb-4 text-xs text-[#1B3A68]/60">

            <span className="text-[#ECB44D]">✦</span>

            <span>MONITOR</span>

            <span className="w-1 h-1 rounded-full bg-[#6FB8E6]" />

            <span>GUIDE</span>

            <span className="w-1 h-1 rounded-full bg-[#ECB44D]" />

            <span>INSPIRE</span>

            <span className="text-[#6FB8E6]">✧</span>

          </div>

        </div>
      </div>
  );
};

export default LecturerDashboard;