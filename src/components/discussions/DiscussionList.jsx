import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import DiscussionCard from './DiscussionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { MessageSquare, Plus } from 'lucide-react';

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
      let next = [];
      if (isLecturerRoute) {
        const response = await projectApi.getMyProjects();
        next = (response.data || []).map((p) => ({
          projectId: p.projectId,
          title: p.title
        }));
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
        next = Object.values(map);
      }
      setProjects(next);
      if (!projectIdProp && !selectedProjectId && next.length > 0) {
        handleProjectChange(String(next[0].projectId));
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

  const createButton = canCreate && selectedProjectId ? (
    <button type="button" onClick={handleCreateDiscussion} className="btn-primary">
      <Plus className="w-4 h-4" strokeWidth={2} />
      New discussion
    </button>
  ) : null;

  if (loading && isEmbedded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-5">
      {isEmbedded ? (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">Discussions</h2>
            {selectedTitle && (
              <p className="page-kicker">
                {selectedTitle} · {discussions.length} thread{discussions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {createButton}
        </div>
      ) : (
        <PageHeader
          icon={MessageSquare}
          title="Discussions"
          description={selectedTitle
            ? `${selectedTitle} · ${discussions.length} thread${discussions.length !== 1 ? 's' : ''}`
            : 'Choose a project to view its discussion threads.'}
          actions={createButton}
        />
      )}

      {!isEmbedded && (
        <div>
          <label className="label" htmlFor="discussion-project">Project</label>
          <select
            id="discussion-project"
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
      )}

      {!selectedProjectId && !isEmbedded ? (
        <EmptyState
          icon={MessageSquare}
          title="Select a project"
          description="Choose a project to view its discussions."
        />
      ) : loading ? (
        <LoadingSpinner />
      ) : discussions.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No discussions yet"
          description="Start a conversation about your project. Discuss ideas, share updates, and collaborate with your team."
          actionText={canCreate ? 'Start a discussion' : undefined}
          actionLink={canCreate ? `${basePath}/discussions/create?projectId=${selectedProjectId}` : undefined}
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
