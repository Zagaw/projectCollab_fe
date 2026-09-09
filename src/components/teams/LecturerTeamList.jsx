import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import TeamList from './TeamList';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const LecturerTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const projectsRes = await projectApi.getMyProjects();
      const projects = projectsRes.data || [];

      const nested = await Promise.all(
        projects.map(async (project) => {
          try {
            const teamsRes = await teamApi.getTeamsByProject(project.projectId);
            return teamsRes.data || [];
          } catch {
            return [];
          }
        })
      );

      setTeams(nested.flat());
    } catch (error) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">All teams across your projects</p>
        </div>
        <Link
          to="/lecturer/projects"
          className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create team from a project
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Yet</h3>
          <p className="text-gray-500 mb-4">Open a project to create its first team.</p>
          <Link
            to="/lecturer/projects"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Projects
          </Link>
        </div>
      ) : (
        <TeamList teams={teams} onTeamUpdate={fetchTeams} />
      )}
    </div>
  );
};

export default LecturerTeamList;
