import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import ProjectFileLibrary from './ProjectFileLibrary';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

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
      if (isLecturerRoute) {
        const response = await projectApi.getMyProjects();
        setProjects((response.data || []).map((p) => ({
          projectId: p.projectId,
          title: p.title,
        })));
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
        setProjects(Object.values(map));
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
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Files</h1>
        <p className="text-sm text-gray-600 mt-1">
          {selectedTitle ? `${selectedTitle} document library` : 'Choose a project to browse its files.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
        <select
          value={selectedProjectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
          title="Select a Project"
          description="Choose a project to view and upload documents."
        />
      ) : (
        <ProjectFileLibrary projectId={selectedProjectId} />
      )}
    </div>
  );
};

export default FileLibraryPage;
