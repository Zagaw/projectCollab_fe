import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600">Projects you are participating in</p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No Projects Yet"
          description="You haven't been added to any project team yet."
          icon="📁"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.projectId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{project.projectTitle}</h3>
              <p className="text-sm text-gray-600 mt-1">Team: {project.teamName}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`${basePath}/projects/${project.projectId}`}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  View Details
                </Link>
                <Link
                  to={`${basePath}/teams/${project.teamId}`}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition text-center"
                >
                  👥 Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProjectList;