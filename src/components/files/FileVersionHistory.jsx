import React, { useState, useEffect } from 'react';
import fileApi from '../../api/fileApi';
import { formatFileSize, formatDate } from '../../utils/helper';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const FileVersionHistory = ({ file, onClose, onVersionUpdated }) => {
  const { user } = useAuth();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [changeComment, setChangeComment] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareV1, setCompareV1] = useState(null);
  const [compareV2, setCompareV2] = useState(null);
  const [compareResult, setCompareResult] = useState(null);

  // Check if user can upload/rollback
  const canManage = user?.role === 'TEAM_LEADER' || user?.role === 'LECTURER' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'LECTURER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchVersions();
  }, [file.fileId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fileApi.getFileVersions(file.fileId);
      setVersions(response.data || []);
    } catch (error) {
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (version) => {
    try {
      const response = await fileApi.downloadVersion(file.fileId, version.versionNumber);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `v${version.versionNumber}_${version.fileName}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloading version ${version.versionNumber}`);
    } catch (error) {
      toast.error('Failed to download version');
    }
  };

  const handleUploadNewVersion = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await fileApi.uploadVersion(file.fileId, selectedFile, changeComment);
      toast.success('New version uploaded successfully!');
      setSelectedFile(null);
      setChangeComment('');
      setShowUploadForm(false);
      await fetchVersions();
      onVersionUpdated?.();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload new version');
    } finally {
      setUploading(false);
    }
  };

  const handleRollback = async (versionNumber) => {
    if (!window.confirm(`Are you sure you want to rollback to version ${versionNumber}?`)) return;
    
    try {
      await fileApi.rollbackToVersion(file.fileId, versionNumber, `Rollback to version ${versionNumber}`);
      toast.success(`Rolled back to version ${versionNumber}`);
      await fetchVersions();
      onVersionUpdated?.();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to rollback');
    }
  };

  const handleDeleteVersion = async (versionNumber) => {
    if (!window.confirm(`Are you sure you want to delete version ${versionNumber}?`)) return;
    
    try {
      await fileApi.deleteVersion(file.fileId, versionNumber);
      toast.success(`Version ${versionNumber} deleted`);
      await fetchVersions();
      onVersionUpdated?.();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete version');
    }
  };

  const handleCompare = async () => {
    if (!compareV1 || !compareV2) {
      toast.error('Please select two versions to compare');
      return;
    }
    if (compareV1 === compareV2) {
      toast.error('Please select different versions');
      return;
    }

    try {
      const response = await fileApi.compareVersions(file.fileId, compareV1, compareV2);
      setCompareResult(response.data);
    } catch (error) {
      toast.error('Failed to compare versions');
    }
  };

  const getVersionLabel = (version) => {
    if (version.isCurrentVersion) {
      return 'Current';
    }
    return `v${version.versionNumber}`;
  };

  const getStatusBadge = (version) => {
    if (version.isCurrentVersion) {
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Current</span>;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl">🔄</span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                Version History
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {file.fileName} • {versions.length} version{versions.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Actions Bar */}
          <div className="flex flex-wrap gap-2">
            {canManage && (
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload New Version
              </button>
            )}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {compareMode ? 'Cancel Compare' : 'Compare Versions'}
            </button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <form onSubmit={handleUploadNewVersion} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select File *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Comment
                  </label>
                  <input
                    type="text"
                    value={changeComment}
                    onChange={(e) => setChangeComment(e.target.value)}
                    placeholder="What changed in this version?"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload New Version'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Compare Mode */}
          {compareMode && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version 1
                  </label>
                  <select
                    value={compareV1 || ''}
                    onChange={(e) => setCompareV1(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Select version</option>
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        v{v.versionNumber} {v.isCurrentVersion ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version 2
                  </label>
                  <select
                    value={compareV2 || ''}
                    onChange={(e) => setCompareV2(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Select version</option>
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        v{v.versionNumber} {v.isCurrentVersion ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCompare}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Compare
                </button>
              </div>

              {/* Compare Result */}
              {compareResult && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Comparison Result</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Version {compareResult.version1Number}</p>
                      <p className="font-medium">{formatFileSize(compareResult.version1Size)}</p>
                      <p className="text-xs text-gray-400">{formatDate(compareResult.version1UploadedAt)}</p>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg flex flex-col justify-center">
                      <p className="text-indigo-600 font-medium">Difference</p>
                      <p className={compareResult.sizeDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {compareResult.sizeDifference >= 0 ? '+' : ''}
                        {formatFileSize(compareResult.sizeDifference)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {compareResult.sizeDifferencePercent?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Version {compareResult.version2Number}</p>
                      <p className="font-medium">{formatFileSize(compareResult.version2Size)}</p>
                      <p className="text-xs text-gray-400">{formatDate(compareResult.version2UploadedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Version List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">📄</span>
              <p>No versions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version.versionId}
                  className={`p-4 rounded-lg border ${
                    version.isCurrentVersion ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                  } transition`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">
                          Version {version.versionNumber}
                        </span>
                        {getStatusBadge(version)}
                        <span className="text-sm text-gray-500">
                          • {formatFileSize(version.fileSize)}
                        </span>
                        <span className="text-sm text-gray-500">
                          • Uploaded by {version.uploadedByName || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        📅 {formatDate(version.createdAt)}
                      </p>
                      {version.changeComment && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          💬 {version.changeComment}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownload(version)}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                      >
                        Download
                      </button>
                      {canManage && !version.isCurrentVersion && (
                        <button
                          onClick={() => handleRollback(version.versionNumber)}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition"
                        >
                          Rollback
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteVersion(version.versionNumber)}
                          disabled={versions.length <= 1}
                          className={`px-3 py-1 text-sm rounded-lg transition ${
                            versions.length <= 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          title={versions.length <= 1 ? 'Cannot delete the only version' : ''}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          Showing {versions.length} version{versions.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default FileVersionHistory;