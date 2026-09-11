import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import ProjectFileLibrary from './ProjectFileLibrary';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Files } from 'lucide-react';

const FileLibraryPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('projectId') || '');

  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');

  useEffect(() => {
    fetchProjectsForPicker();
  }, []);

  const fetchProjectsForPicker = async () => {
    try {
      let next = [];
      if (isLecturerRoute) {
        const response = await projectApi.getMyProjects();
        next = (response.data || []).map((p) => ({
          projectId: p.projectId,
          title: p.title,
        }));
      } else {
        const response = await teamApi.getMyTeams();
        const map = {};
        (response.data || []).forEach((team) => {
          if (team.projectId && !map[team.projectId]) {
            map[team.projectId] = {
              projectId: team.projectId,
              title: team.projectTitle,
            };
          }
        });
        next = Object.values(map);
      }
      setProjects(next);
      if (!selectedProjectId && next.length > 0) {
        handleProjectChange(String(next[0].projectId));
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      setSearchParams({ projectId });
    } else {
      setSearchParams({});
    }
  };

  const selectedTitle = projects.find((p) => String(p.projectId) === String(selectedProjectId))?.title;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Files}
        title="Files"
        description={selectedTitle ? `${selectedTitle} document library` : 'Choose a project to browse its files.'}
      />

      <div>
        <label className="label" htmlFor="file-library-project">Project</label>
        <select
          id="file-library-project"
          value={selectedProjectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="field max-w-md"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {!selectedProjectId ? (
        <EmptyState
          icon={Files}
          title="Select a project"
          description="Choose a project to view and upload documents."
        />
      ) : (
        <ProjectFileLibrary projectId={selectedProjectId} />
      )}
    </div>
  );
};

export default FileLibraryPage;
