import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

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
      <EmptyState
        icon={MessageSquare}
        title="Project required"
        description="Select a project first to view discussions."
        actionText="Go to discussions"
        actionLink={`${basePath}/discussions`}
      />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!discussion) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Discussion not found"
        description="It may have been deleted, or you do not have access."
        actionText="Back to discussions"
        onAction={handleBack}
      />
    );
  }

  const replyCount = discussion.replies?.length || 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <button type="button" onClick={handleBack} className="text-sm text-indigo-700 hover:text-indigo-800 mb-2">
            Back to project
          </button>
          <h1 className="page-title">{discussion.title}</h1>
          <p className="page-kicker">
            {discussion.createdByName || 'Unknown'} · {getTimeAgo(discussion.createdAt)} · {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </p>
        </div>
        {canDelete() && (
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-danger">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      <div className="surface p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
            <span className="text-indigo-700 font-semibold text-sm">
              {getInitials(discussion.createdByName)}
            </span>
          </div>
          <span className="text-sm font-medium text-ink">{discussion.createdByName || 'Unknown'}</span>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{discussion.content}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">
          Replies ({replyCount})
        </h3>

        {discussion.replies && discussion.replies.length > 0 ? (
          discussion.replies.map((reply) => (
            <div key={reply.replyId} className="surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold text-xs">
                    {getInitials(reply.userName)}
                  </span>
                </div>
                <span className="text-sm font-medium text-ink">{reply.userName || 'Unknown'}</span>
                <span className="text-xs text-gray-500">{getTimeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{reply.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 surface px-4 py-8 text-center">No replies yet. Be the first to respond.</p>
        )}
      </div>

      <div className="surface p-5 sm:p-6">
        <h4 className="font-semibold text-ink mb-3">Add a reply</h4>
        <form onSubmit={handleReply} className="space-y-3">
          <div>
            <label className="label" htmlFor="discussion-reply">Reply</label>
            <textarea
              id="discussion-reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="4"
              placeholder="Write your reply..."
              className="field resize-none"
              disabled={replying}
            />
          </div>
          <button type="submit" disabled={replying} className="btn-primary">
            {replying ? 'Posting...' : 'Post reply'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionDetails;
