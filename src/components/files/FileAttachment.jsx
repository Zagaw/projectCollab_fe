import React, { useState } from 'react';
import fileApi from '../../api/fileApi';
import { formatFileSize } from '../../utils/helper';
import toast from 'react-hot-toast';

const FileAttachment = ({ file, onDelete, showDelete = true }) => {
  const [loading, setLoading] = useState(false);

  const fileIcon = () => {
    const type = file.fileType || '';
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('json') || type.includes('xml')) return '📋';
    return '📎';
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fileApi.downloadFile(file.fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${file.fileName}"?`)) return;
    try {
      await onDelete(file.fileId);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete file');
    }
  };

  return (
    <div className="group flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
      <div className="text-2xl">{fileIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>
          {file.fileName}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{formatFileSize(file.fileSize)}</span>
          <span>•</span>
          <span>Uploaded by {file.uploadedByName || 'Unknown'}</span>
          <span>•</span>
          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
          title="Download"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
        
        {showDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FileAttachment;