import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const CommentList = ({
  entityType,
  entityId,
  comments: initialComments = [],
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
  isLoading = false,
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(isLoading);
  const [teamFilter, setTeamFilter] = useState('ALL');

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // ✅ FIX: Handle adding a new comment (top-level or reply)
  const handleSubmit = async (formData) => {
    try {
      const newComment = await onCommentAdded(formData);
      if (newComment) {
        // Check if it's a reply (has parentCommentId)
        if (newComment.parentCommentId) {
          // It's a reply - update the parent comment's reply list
          const updatedComments = comments.map((comment) => {
            if (comment.commentId === newComment.parentCommentId) {
              return {
                ...comment,
                replyCount: (comment.replyCount || 0) + 1,
              };
            }
            return comment;
          });
          setComments(updatedComments);
        } else {
          // Top-level comment - add to the top
          setComments([newComment, ...comments]);
        }
      }
      return newComment;
    } catch (error) {
      throw error;
    }
  };

  const handleReply = async (parentId, formData) => {
    try {
      // Pass the parentId to the API call
      const reply = await onCommentAdded(formData);
      if (reply) {
        // Update the parent comment's reply count
        const updatedComments = comments.map((comment) => {
          if (comment.commentId === parentId) {
            return {
              ...comment,
              replyCount: (comment.replyCount || 0) + 1,
            };
          }
          return comment;
        });
        setComments(updatedComments);
      }
      return reply;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = (updatedComment) => {
    const updatedComments = comments.map((comment) => {
      if (comment.commentId === updatedComment.commentId) {
        return updatedComment;
      }
      return comment;
    });
    setComments(updatedComments);
    onCommentUpdated?.(updatedComment);
  };

  const handleDelete = (commentId) => {
    setComments(comments.filter((c) => c.commentId !== commentId));
    onCommentDeleted?.(commentId);
  };

  const teamNames = [...new Set(comments.map((c) => c.teamName).filter(Boolean))];
  const visibleComments = teamFilter === 'ALL'
    ? comments
    : comments.filter((c) => c.teamName === teamFilter);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Comment Form - Top level */}
      <CommentForm
        onSubmit={handleSubmit}
        placeholder={`Add a comment to this ${entityType}...`}
      />

      {entityType === 'project' && teamNames.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Filter by team</label>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs"
          >
            <option value="ALL">All teams</option>
            {teamNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Comments List */}
      {visibleComments.length === 0 ? (
        <EmptyState
          title="No Comments Yet"
          description={`Be the first to add a comment to this ${entityType}!`}
          icon="💬"
        />
      ) : (
        <div className="space-y-3">
          {visibleComments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onReply={handleReply}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;