import React, { useState } from 'react';
import fileApi from '../../api/fileApi';
import FileVersionHistory from './FileVersionHistory';
import { formatFileSize } from '../../utils/helper';
import toast from 'react-hot-toast';

const FileAttachment = ({ file, onDelete, showDelete = true, onVersionUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

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

  const handleVersionUpdated = () => {
    onVersionUpdated?.();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 surface">
        <button
          type="button"
          className="flex-1 min-w-0 text-left"
          onClick={() => setShowVersionHistory(true)}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ink truncate" title={file.fileName}>
              {file.fileName}
            </p>
            {file.versionNumber && file.versionNumber > 1 && (
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                v{file.versionNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatFileSize(file.fileSize)}
            {' · '}
            {file.uploadedByName || 'Unknown'}
            {' · '}
            {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="btn-secondary !py-1 !px-2 text-xs"
          >
            {loading ? 'Downloading...' : 'Download'}
          </button>
          <button
            type="button"
            onClick={() => setShowVersionHistory(true)}
            className="btn-secondary !py-1 !px-2 text-xs"
          >
            History
          </button>
          {showDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger !py-1 !px-2 text-xs"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showVersionHistory && (
        <FileVersionHistory
          file={file}
          onClose={() => setShowVersionHistory(false)}
          onVersionUpdated={handleVersionUpdated}
        />
      )}
    </>
  );
};

export default FileAttachment;
