import React, { useState, useEffect } from 'react';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import ProjectCard from './ProjectCard';
import toast from 'react-hot-toast';

const StudentProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine base path
  const pathname = window.location.pathname;
  const isStudentRoute = pathname.includes('/student');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isStudentRoute ? '/student' : 
                   isTeamLeaderRoute ? '/teamleader' : '/student';

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const teamsRes = await teamApi.getMyTeams();
      const teams = teamsRes.data || [];
      
      // Extract unique projects from teams
      const projectMap = {};
      teams.forEach(team => {
        if (team.projectId && !projectMap[team.projectId]) {
          projectMap[team.projectId] = {
            projectId: team.projectId,
            projectTitle: team.projectTitle,
            teamName: team.name,
            teamId: team.teamId,
            // We'll fetch more details if needed
          };
        }
      });
      
      setProjects(Object.values(projectMap));
    } catch (error) {
      toast.error('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My projects"
        description="Projects you are participating in."
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="You haven't been added to any project team yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={{
                projectId: project.projectId,
                title: project.projectTitle,
                description: project.teamName ? `Your team: ${project.teamName}` : undefined,
              }}
              detailsTo={`${basePath}/projects/${project.projectId}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProjectList;
