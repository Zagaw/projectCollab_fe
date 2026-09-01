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
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none resize-none"
        disabled={loading}
      />

      {!isEdit && (
        <FileUploader onFilesSelect={setFiles} maxFiles={5} />
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isEdit ? 'Updating...' : 'Posting...'}
            </span>
          ) : (
            isEdit ? 'Update Comment' : 'Post Comment'
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;