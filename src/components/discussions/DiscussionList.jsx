import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import DiscussionCard from './DiscussionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const DiscussionList = ({ projectId: projectIdProp, projectTitle }) => {
  const [discussions, setDiscussions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isStudentRoute = pathname.includes('/student');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' :
                   isTeamLeaderRoute ? '/teamleader' :
                   isStudentRoute ? '/student' : '/student';

  const isEmbedded = Boolean(projectIdProp);
  const canCreate = isLecturerRoute || isTeamLeaderRoute;
  const [selectedProjectId, setSelectedProjectId] = useState(
    projectIdProp || searchParams.get('projectId') || ''
  );

  useEffect(() => {
    if (!isEmbedded) {
      fetchProjectsForPicker();
    }
  }, []);

  useEffect(() => {
    if (projectIdProp) {
      setSelectedProjectId(projectIdProp);
    }
  }, [projectIdProp]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchDiscussions();
    } else if (isEmbedded) {
      setLoading(false);
      toast.error('Project ID is required');
    } else {
      setDiscussions([]);
      setLoading(false);
    }
  }, [selectedProjectId]);

  const fetchProjectsForPicker = async () => {
    try {
      if (isLecturerRoute) {
        const response = await projectApi.getMyProjects();
        setProjects((response.data || []).map((p) => ({
          projectId: p.projectId,
          title: p.title
        })));
      } else {
        const response = await teamApi.getMyTeams();
        const map = {};
        (response.data || []).forEach((team) => {
          if (team.projectId && !map[team.projectId]) {
            map[team.projectId] = {
              projectId: team.projectId,
              title: team.projectTitle
            };
          }
        });
        setProjects(Object.values(map));
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await discussionApi.getDiscussions(selectedProjectId);
      setDiscussions(response.data || []);
    } catch (error) {
      toast.error('Failed to load discussions');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    if (!isEmbedded) {
      if (projectId) {
        setSearchParams({ projectId });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleCreateDiscussion = () => {
    navigate(`${basePath}/discussions/create?projectId=${selectedProjectId}`, {
      state: { projectId: selectedProjectId }
    });
  };

  const handleViewDiscussion = (discussionId) => {
    navigate(`${basePath}/discussions/${discussionId}?projectId=${selectedProjectId}`, {
      state: { projectId: selectedProjectId }
    });
  };

  const selectedTitle = projectTitle
    || projects.find((p) => String(p.projectId) === String(selectedProjectId))?.title;

  if (loading && isEmbedded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Discussions</h2>
          {selectedTitle && (
            <p className="text-sm text-gray-600">
              {selectedTitle} • {discussions.length} discussion{discussions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {canCreate && selectedProjectId && (
          <button
            onClick={handleCreateDiscussion}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Discussion
          </button>
        )}
      </div>

      {!isEmbedded && (
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
      )}

      {!selectedProjectId && !isEmbedded ? (
        <EmptyState
          title="Select a Project"
          description="Choose a project to view its discussions."
          icon="💬"
        />
      ) : loading ? (
        <LoadingSpinner />
      ) : discussions.length === 0 ? (
        <EmptyState
          title="No Discussions Yet"
          description="Start a conversation about your project. Discuss ideas, share updates, and collaborate with your team."
          actionText={canCreate ? 'Start a Discussion' : undefined}
          actionLink={canCreate ? `${basePath}/discussions/create?projectId=${selectedProjectId}` : undefined}
          icon="💬"
        />
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.discussionId}
              discussion={discussion}
              onView={handleViewDiscussion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;
