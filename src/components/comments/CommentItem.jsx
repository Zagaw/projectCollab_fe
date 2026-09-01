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
    <div className={`${isReply ? 'ml-8' : ''}`}>
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {comment.userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {comment.userName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
                {comment.updatedAt && (
                  <span className="ml-2 text-gray-400">(edited)</span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isOwner && !comment.isDeleted && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {comment.isDeleted ? (
          <p className="text-sm text-gray-400 italic mt-2">This comment was deleted</p>
        ) : isEditing ? (
          // ✅ FIX: Edit form
          <div className="mt-2">
            <CommentForm
              initialContent={comment.content}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              isEdit
            />
          </div>
        ) : (
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        {/* Files */}
        {!comment.isDeleted && hasFiles && (
          <FileAttachmentList
            files={comment.files}
            onDelete={handleFileDelete}
            showDelete={isOwner}
          />
        )}

        {/* Reply & Actions */}
        {!comment.isDeleted && !isReply && (
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 hover:text-indigo-600 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>

            {hasReplies && (
              <button
                onClick={handleLoadReplies}
                className="text-xs text-gray-500 hover:text-indigo-600 transition flex items-center gap-1"
              >
                {showReplies ? 'Hide replies' : `View ${comment.replyCount} repl${comment.replyCount > 1 ? 'ies' : 'y'}`}
                {loadingReplies && (
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
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

      {/* Replies */}
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