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
import toast from 'react-hot-toast';

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
    return <div>Project not found</div>;
  }

  const tabs = ['overview', 'teams', 'comments', 'discussions', 'files', 'activity'];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(`${basePath}/projects`)}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Projects
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600">{project.course} • {project.semester}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
            project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
            project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">{project.description || 'No description provided'}</p>
            </div>

            <ProjectProgressOverview projectId={projectId} basePath={basePath} />

            {/* Lecturer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Lecturer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {project.lecturerName?.charAt(0) || 'L'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{project.lecturerName}</p>
                  <p className="text-sm text-gray-500">{project.lecturerEmail}</p>
                </div>
              </div>
            </div>

            {/* Teams Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Teams</h3>
              <div className="flex flex-wrap gap-2">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <Link
                      key={team.teamId}
                      to={`${basePath}/teams/${team.teamId}`}
                      className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition"
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

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Teams:</span>
                  <p className="font-medium">{project.teamCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Teams</h3>
          {teams.length === 0 ? (
            <p className="text-gray-500">No teams assigned to this project.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <Link
                  key={team.teamId}
                  to={`${basePath}/teams/${team.teamId}`}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition border border-gray-100"
                >
                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                  <p className="text-sm text-gray-500">{team.totalMembers || 0} members</p>
                  <p className="text-sm text-gray-500">Leader: {team.teamLeader?.fullName || 'Not assigned'}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <DiscussionList 
            projectId={projectId} 
            projectTitle={project.title}
          />
        </div>
      )}

      {activeTab === 'files' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Files</h3>
          <ProjectFileLibrary projectId={projectId} teams={teams} />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Activity</h3>
          <ActivityTimeline projectId={projectId} />
        </div>
      )}
    </div>
  );
};

export default StudentProjectDetails;