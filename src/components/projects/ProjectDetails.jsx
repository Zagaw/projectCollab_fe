import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import TeamList from '../teams/TeamList';
import CommentList from '../comments/CommentList';
import commentApi from '../../api/commentApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { FolderKanban, Users, Plus } from 'lucide-react';
import DiscussionList from '../discussions/DiscussionList';
import ActivityTimeline from '../activity/ActivityTimeline';
import ProjectFileLibrary from '../files/ProjectFileLibrary';
import ProjectProgressOverview from '../progress/ProjectProgressOverview';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'teams', label: 'Teams' },
  { id: 'comments', label: 'Comments' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'files', label: 'Files' },
  { id: 'activity', label: 'Activity' },
];

const statusColors = {
  ACTIVE: 'bg-green-50 text-green-800',
  COMPLETED: 'bg-indigo-50 text-indigo-800',
  ON_HOLD: 'bg-amber-50 text-amber-800',
  CANCELLED: 'bg-red-50 text-red-700',
};

const statusLabel = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
  CANCELLED: 'Cancelled',
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjectDetails();
    fetchComments();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const [projectRes, teamsRes] = await Promise.all([
        projectApi.getProjectById(projectId),
        teamApi.getTeamsByProject(projectId)
      ]);
      setProject(projectRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await commentApi.getCommentsForProject(projectId);
      setComments(response.data);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await projectApi.updateProjectStatus(projectId, status);
      toast.success(`Project status updated to ${status}`);
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  // ✅ FIXED: Use addCommentToProject instead of addCommentToTask
  const handleCommentAdded = async (formData) => {
    try {
      const response = await commentApi.addCommentToProject(projectId, formData);
      toast.success('Comment added!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add comment');
      throw error;
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map(c => 
      c.commentId === updatedComment.commentId ? updatedComment : c
    ));
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c.commentId !== commentId));
  };

  if (loading) return <LoadingSpinner />;
  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="It may have been deleted, or you do not have access."
        actionText="Back to projects"
        actionLink="/lecturer/projects"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/lecturer/projects')}
            className="text-sm text-indigo-700 hover:text-indigo-800 mb-2"
          >
            Back to projects
          </button>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-kicker">
            {[project.course, project.semester].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-700'}`}>
            {statusLabel[project.status] || project.status}
          </span>
          <Link to={`/lecturer/projects/${projectId}/edit`} className="btn-secondary">
            Edit project
          </Link>
          <Link to={`/lecturer/teams/create?projectId=${projectId}`} className="btn-primary">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Create team
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-4 sm:gap-6 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-1 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="surface p-5 sm:p-6">
              <h3 className="font-semibold text-ink mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{project.description || 'No description yet.'}</p>
            </div>

            <ProjectProgressOverview projectId={projectId} basePath="/lecturer" />

            <div className="surface p-5 sm:p-6">
              <h3 className="font-semibold text-ink mb-3">Lecturer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold">
                    {project.lecturerName?.charAt(0) || 'L'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-ink">{project.lecturerName}</p>
                  <p className="text-sm text-gray-500">{project.lecturerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <StatCard icon={Users} label="Teams" value={teams.length || project.teamCount || 0} />
            </div>
            <div className="surface p-5 sm:p-6">
              <h3 className="font-semibold text-ink mb-3">Dates</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Start</dt>
                  <dd className="font-medium text-ink">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">End</dt>
                  <dd className="font-medium text-ink">{project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}</dd>
                </div>
              </dl>
            </div>

            <div className="surface p-5 sm:p-6">
              <h3 className="font-semibold text-ink mb-3">Update status</h3>
              <div className="space-y-2">
                {['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusUpdate(status)}
                    disabled={status === project.status}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg ${
                      status === project.status
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {statusLabel[status]}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'teams' && (
        <TeamList teams={teams} projectId={projectId} onTeamUpdate={fetchProjectDetails} />
      )}

      {activeTab === 'comments' && (
        <div className="surface p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4">
            Project comments are for the whole project (announcements, lecturer feedback).
            Each comment is labeled with the author's team. Task discussion and task files stay on the task page under a milestone.
          </p>
          <CommentList
            entityType="project"
            entityId={projectId}
            comments={comments}
            onCommentAdded={handleCommentAdded}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
            isLoading={commentsLoading}
          />
        </div>
      )}

      {activeTab === 'discussions' && (
        <DiscussionList
          projectId={projectId}
          projectTitle={project.title}
        />
      )}

      {activeTab === 'files' && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Project files</h3>
          <ProjectFileLibrary projectId={projectId} teams={teams} />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="surface p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">Project activity</h3>
          <ActivityTimeline projectId={projectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
