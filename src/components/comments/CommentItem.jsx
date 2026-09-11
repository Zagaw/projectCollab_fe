import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import FileAttachmentList from '../files/FileAttachmentList';
import commentApi from '../../api/commentApi';
import toast from 'react-hot-toast';

const CommentItem = ({
  comment,
  onReply,
  onUpdate,
  onDelete,
  isReply = false,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isOwner = user?.userId === comment.userId;
  const hasReplies = comment.replyCount > 0;
  const hasFiles = comment.files && comment.files.length > 0;

  const handleLoadReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    setLoadingReplies(true);
    try {
      const response = await commentApi.getRepliesForComment(comment.commentId);
      setReplies(response.data || []);
      setShowReplies(true);
    } catch (error) {
      toast.error('Failed to load replies');
      console.error('Error loading replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentApi.deleteComment(comment.commentId);
      toast.success('Comment deleted');
      onDelete(comment.commentId);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await commentApi.deleteFileFromComment(fileId);
      toast.success('File deleted');
      // Update comment files list
      const updatedFiles = comment.files.filter(f => f.fileId !== fileId);
      onUpdate({
        ...comment,
        files: updatedFiles,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete file');
    }
  };

  // ✅ FIX: Handle edit submission
  const handleEdit = async (formData) => {
    try {
      // Extract content from formData
      const content = formData.get('content');

      // Update the comment via API
      const response = await commentApi.updateComment(comment.commentId, {
        content: content,
      });

      toast.success('Comment updated');
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update comment');
    }
  };

  // ✅ FIX: Handle reply submission
  const handleReplySubmit = async (formData) => {
    try {
      // Extract content from formData
      const content = formData.get('content');

      // Pass to parent with parent comment ID
      await onReply(comment.commentId, formData);
      setShowReplyForm(false);
      toast.success('Reply added');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add reply');
    }
  };

  return (
    <div className={`${isReply ? 'ml-6 sm:ml-8' : ''}`}>
      <div className="surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
              <span className="text-indigo-700 font-semibold text-sm">
                {comment.userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                {comment.userName}
              </p>
              <p className="text-xs text-gray-500">
                {comment.teamName && (
                  <span className="mr-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                    {comment.teamName}
                  </span>
                )}
                {new Date(comment.createdAt).toLocaleString()}
                {comment.updatedAt && (
                  <span className="ml-2 text-gray-400">(edited)</span>
                )}
              </p>
            </div>
          </div>

          {isOwner && !comment.isDeleted && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-gray-600 hover:text-indigo-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-medium text-red-700 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {comment.isDeleted ? (
          <p className="text-sm text-gray-500 italic mt-2">This comment was deleted</p>
        ) : isEditing ? (
          <div className="mt-3">
            <CommentForm
              initialContent={comment.content}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              isEdit
            />
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        {!comment.isDeleted && hasFiles && (
          <FileAttachmentList
            files={comment.files}
            onDelete={handleFileDelete}
            showDelete={isOwner}
            onVersionUpdated={() => {
            // Refresh comment to get updated file info
            onUpdate(comment);
            }}
          />
        )}

        {!comment.isDeleted && !isReply && (
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-medium text-gray-600 hover:text-indigo-700"
            >
              Reply
            </button>

            {hasReplies && (
              <button
                type="button"
                onClick={handleLoadReplies}
                className="text-xs font-medium text-gray-600 hover:text-indigo-700"
              >
                {showReplies ? 'Hide replies' : `View ${comment.replyCount} repl${comment.replyCount > 1 ? 'ies' : 'y'}`}
                {loadingReplies ? '…' : ''}
              </button>
            )}
          </div>
        )}

        {showReplyForm && !comment.isDeleted && (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${comment.userName}...`}
              parentCommentId={comment.commentId}
            />
          </div>
        )}
      </div>

      {showReplies && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
