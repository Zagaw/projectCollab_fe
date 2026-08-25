import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600">Projects you are participating in</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-500">You haven't been added to any project team yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.projectId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{project.projectTitle}</h3>
              <p className="text-sm text-gray-600 mt-1">Team: {project.teamName}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`${basePath}/teams/${project.teamId}`}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition text-center"
                >
                  View Team
                </Link>
                <Link
                  to={`${basePath}/milestones?teamId=${project.teamId}`}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition text-center"
                >
                  🎯 Milestones
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProjects;