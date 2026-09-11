import React, { useState } from 'react';
import FileUploader from '../files/FileUploader';
import toast from 'react-hot-toast';

const CommentForm = ({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = 'Write a comment...',
  isEdit = false,
  parentCommentId = null, // ✅ ADD THIS
}) => {
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && files.length === 0) {
      toast.error('Please enter a comment or attach a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);

      // ✅ ADD: Include parentCommentId if it's a reply
      if (parentCommentId) {
        formData.append('parentCommentId', parentCommentId);
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      await onSubmit(formData);
      setContent('');
      setFiles([]);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={isEdit ? 3 : 3}
        className="field resize-none"
        disabled={loading}
      />

      {!isEdit && (
        <FileUploader onFilesSelect={setFiles} maxFiles={5} />
      )}

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? (isEdit ? 'Updating...' : 'Posting...')
            : (isEdit ? 'Update comment' : 'Post comment')}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
