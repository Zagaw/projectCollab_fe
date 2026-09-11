import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import TeamList from './TeamList';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
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
    <div className="space-y-5">
      <PageHeader
        title="Teams"
        description="All teams across your projects."
        actions={
          <Link to="/lecturer/projects" className="btn-primary">
            Create team from a project
          </Link>
        }
      />

      {teams.length === 0 ? (
        <EmptyState
          title="No teams yet"
          description="Open a project to create its first team."
          actionText="Go to projects"
          actionLink="/lecturer/projects"
        />
      ) : (
        <TeamList teams={teams} onTeamUpdate={fetchTeams} />
      )}
    </div>
  );
};

export default LecturerTeamList;
