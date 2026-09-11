import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import commentApi from '../../api/commentApi';
import CommentList from '../comments/CommentList';
import DiscussionList from '../discussions/DiscussionList';
import ActivityTimeline from '../activity/ActivityTimeline';
import ProjectFileLibrary from '../files/ProjectFileLibrary';
import ProjectProgressOverview from '../progress/ProjectProgressOverview';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { StatCard } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { FolderKanban, Users } from 'lucide-react';

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

const StudentProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Determine base path
  const pathname = window.location.pathname;
  const isStudentRoute = pathname.includes('/student');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isStudentRoute ? '/student' : 
                   isTeamLeaderRoute ? '/teamleader' : '/student';

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchComments();
    }
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
      navigate(`${basePath}/projects`);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await commentApi.getCommentsForProject(projectId);
      setComments(response.data || []);
    } catch (error) {
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentAdded = async (formData) => {
    try {
      const response = await commentApi.addCommentToProject(projectId, formData);
      toast.success('Comment added!');
      await fetchComments();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="It may have been deleted, or you do not have access."
        actionText="Back to projects"
        actionLink={`${basePath}/projects`}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/projects`)}
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

            <ProjectProgressOverview projectId={projectId} basePath={basePath} />

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

            <div className="surface p-5 sm:p-6">
              <h3 className="font-semibold text-ink mb-3">Teams</h3>
              <div className="flex flex-wrap gap-2">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <Link
                      key={team.teamId}
                      to={`${basePath}/teams/${team.teamId}`}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-ink hover:bg-gray-100 transition"
                    >
                      {team.name} ({team.totalMembers || 0} members)
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No teams assigned yet.</p>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <StatCard icon={Users} label="Teams" value={teams.length || project.teamCount || 0} />
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
          </aside>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="surface p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">Project teams</h3>
          {teams.length === 0 ? (
            <p className="text-gray-500">No teams assigned to this project.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <Link
                  key={team.teamId}
                  to={`${basePath}/teams/${team.teamId}`}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-indigo-200 transition"
                >
                  <h4 className="font-medium text-ink">{team.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{team.totalMembers || 0} members</p>
                  <p className="text-sm text-gray-500">Leader: {team.teamLeader?.fullName || 'Not assigned'}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="surface p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4">
            Project comments are for the whole project. Each comment is labeled with the author's team.
            Comments and files on a specific task stay on that task's page.
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

export default StudentProjectDetails;
