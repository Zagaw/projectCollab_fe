import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { FolderKanban } from 'lucide-react';

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine base path
  const pathname = window.location.pathname;
  const isStudentRoute = pathname.includes('/student');
  const basePath = isStudentRoute ? '/student' : '/student';

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const teamsRes = await teamApi.getMyTeams();
      const teams = teamsRes.data || [];
      
      const projectMap = {};
      teams.forEach(team => {
        if (team.projectId && !projectMap[team.projectId]) {
          projectMap[team.projectId] = {
            projectId: team.projectId,
            projectTitle: team.projectTitle,
            teamName: team.name,
            teamId: team.teamId
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={FolderKanban}
        title="My projects"
        description="Projects you are participating in."
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="You haven't been added to any project team yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article key={project.projectId} className="surface p-5 flex flex-col">
              <h3 className="text-lg font-semibold text-ink mb-2 line-clamp-1">{project.projectTitle}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                {project.teamName ? `Your team: ${project.teamName}` : 'No team assigned.'}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Link
                  to={`${basePath}/teams/${project.teamId}`}
                  className="btn-primary flex-1"
                >
                  View team
                </Link>
                <Link
                  to={`${basePath}/milestones?teamId=${project.teamId}`}
                  className="btn-secondary"
                >
                  Milestones
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProjects;
