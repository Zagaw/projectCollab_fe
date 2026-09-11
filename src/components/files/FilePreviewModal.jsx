import React, { useState, useEffect } from 'react';
import fileApi from '../../api/fileApi';
import { formatFileSize } from '../../utils/helper';
import toast from 'react-hot-toast';

const FilePreviewModal = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (file) {
      loadPreview();
    }
  }, [file]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      const response = await fileApi.viewFile(file.fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPreviewUrl(url);
    } catch (error) {
      toast.error('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
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
    }
  };

  if (!file) return null;

  const isImage = file.fileType?.startsWith('image/');
  const isPDF = file.fileType === 'application/pdf';
  const isText = file.fileType?.startsWith('text/');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-200">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-ink truncate">
              {file.fileName}
            </h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(file.fileSize)} · {file.fileType || 'Unknown type'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={handleDownload} className="btn-primary !py-2">
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-lg transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-paper">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : isImage ? (
            <img src={previewUrl} alt={file.fileName} className="max-w-full max-h-full mx-auto object-contain" />
          ) : isPDF ? (
            <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg bg-white" title={file.fileName} />
          ) : isText ? (
            <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg bg-white" title={file.fileName} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg font-medium text-ink">Preview not available</p>
              <p className="text-sm mt-1">Click Download to view this file.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
