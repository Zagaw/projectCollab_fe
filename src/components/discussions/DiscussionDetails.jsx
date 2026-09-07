import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const DiscussionDetails = () => {
  const { discussionId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get projectId from searchParams OR location state
  const projectId = searchParams.get('projectId') || location.state?.projectId;

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isStudentRoute = pathname.includes('/student');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/student';

  useEffect(() => {
    if (!projectId) {
      toast.error('Project ID is required');
      navigate(`${basePath}/discussions`);
      return;
    }
    if (discussionId) {
      fetchDiscussion();
    }
  }, [discussionId, projectId]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const response = await discussionApi.getDiscussionById(projectId, discussionId);
      setDiscussion(response.data);
    } catch (error) {
      console.error('Error fetching discussion:', error);
      toast.error('Failed to load discussion');
      // ✅ FIX: Navigate back to project details discussions tab
      navigate(`${basePath}/projects/${projectId}?tab=discussions`);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setReplying(true);
    try {
      await discussionApi.addReply(projectId, discussionId, replyContent);
      toast.success('Reply added!');
      setReplyContent('');
      await fetchDiscussion();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add reply');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    setDeleting(true);
    try {
      await discussionApi.deleteDiscussion(projectId, discussionId);
      toast.success('Discussion deleted');
      // ✅ FIX: Navigate back to project details discussions tab
      navigate(`${basePath}/projects/${projectId}?tab=discussions`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete discussion');
    } finally {
      setDeleting(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getInitials = (name) => {
    return name?.charAt(0) || 'U';
  };

  const canDelete = () => {
    if (!discussion) return false;
    if (!user) return false;
    if (user.role === 'ADMIN' || user.role === 'LECTURER') return true;
    return discussion.createdBy === user.userId;
  };

  // ✅ FIX: Back button - go to project details discussions tab
  const handleBack = () => {
    navigate(`${basePath}/projects/${projectId}?tab=discussions`);
  };

  if (!projectId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900">Project ID Required</h2>
        <p className="text-gray-600 mt-2">Please select a project first to view discussions.</p>
        <button
          onClick={() => navigate(`${basePath}/discussions`)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Discussions
        </button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={handleBack}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            ← Back to Project
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{discussion.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-xs">
                  {getInitials(discussion.createdByName)}
                </span>
              </div>
              <span className="text-sm text-gray-600">{discussion.createdByName || 'Unknown'}</span>
            </div>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{getTimeAgo(discussion.createdAt)}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">💬 {discussion.replies?.length || 0} replies</span>
          </div>
        </div>
        {canDelete() && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
          >
            {deleting ? 'Deleting...' : 'Delete Discussion'}
          </button>
        )}
      </div>

      {/* Original Post */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{discussion.content}</p>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {discussion.replies?.length || 0} Replies
        </h3>

        {discussion.replies && discussion.replies.length > 0 ? (
          discussion.replies.map((reply) => (
            <div key={reply.replyId} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">
                    {getInitials(reply.userName)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{reply.userName || 'Unknown'}</span>
                <span className="text-xs text-gray-400">{getTimeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No replies yet. Be the first to respond!</p>
          </div>
        )}
      </div>

      {/* Reply Form */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h4 className="font-medium text-gray-900 mb-3">Add Your Reply</h4>
        <form onSubmit={handleReply}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="4"
            placeholder="Write your reply..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none resize-none"
            disabled={replying}
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              type="submit"
              disabled={replying}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {replying ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionDetails;