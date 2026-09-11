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

  const getStatusBadge = (version) => {
    if (version.isCurrentVersion) {
      return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">Current</span>;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-ink truncate">
              Version history
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {file.fileName} · {versions.length} version{versions.length !== 1 ? 's' : ''}
            </p>
          </div>
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {canManage && (
              <button
                type="button"
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-primary !py-2"
              >
                Upload new version
              </button>
            )}
            <button
              type="button"
              onClick={() => setCompareMode(!compareMode)}
              className="btn-secondary !py-2"
            >
              {compareMode ? 'Cancel compare' : 'Compare versions'}
            </button>
          </div>

          {showUploadForm && (
            <div className="surface p-4">
              <form onSubmit={handleUploadNewVersion} className="space-y-3">
                <div>
                  <label className="label">Select file</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="version-comment">Change comment</label>
                  <input
                    id="version-comment"
                    type="text"
                    value={changeComment}
                    onChange={(e) => setChangeComment(e.target.value)}
                    placeholder="What changed in this version?"
                    className="field"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" disabled={uploading} className="btn-primary">
                    {uploading ? 'Uploading...' : 'Upload new version'}
                  </button>
                  <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {compareMode && (
            <div className="surface p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="label" htmlFor="compare-v1">Version 1</label>
                  <select
                    id="compare-v1"
                    value={compareV1 || ''}
                    onChange={(e) => setCompareV1(Number(e.target.value))}
                    className="field"
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
                  <label className="label" htmlFor="compare-v2">Version 2</label>
                  <select
                    id="compare-v2"
                    value={compareV2 || ''}
                    onChange={(e) => setCompareV2(Number(e.target.value))}
                    className="field"
                  >
                    <option value="">Select version</option>
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        v{v.versionNumber} {v.isCurrentVersion ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={handleCompare} className="btn-primary">
                  Compare
                </button>
              </div>

              {compareResult && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="surface p-3 text-center">
                    <p className="text-gray-500">Version {compareResult.version1Number}</p>
                    <p className="font-medium text-ink">{formatFileSize(compareResult.version1Size)}</p>
                    <p className="text-xs text-gray-500">{formatDate(compareResult.version1UploadedAt)}</p>
                  </div>
                  <div className="surface p-3 text-center bg-indigo-50 border-indigo-100">
                    <p className="text-indigo-700 font-medium">Difference</p>
                    <p className={compareResult.sizeDifference >= 0 ? 'text-ink' : 'text-red-700'}>
                      {compareResult.sizeDifference >= 0 ? '+' : ''}
                      {formatFileSize(compareResult.sizeDifference)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {compareResult.sizeDifferencePercent?.toFixed(1)}%
                    </p>
                  </div>
                  <div className="surface p-3 text-center">
                    <p className="text-gray-500">Version {compareResult.version2Number}</p>
                    <p className="font-medium text-ink">{formatFileSize(compareResult.version2Size)}</p>
                    <p className="text-xs text-gray-500">{formatDate(compareResult.version2UploadedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : versions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No versions found.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((version) => (
                    <tr key={version.versionId} className={version.isCurrentVersion ? 'bg-indigo-50/60' : 'odd:bg-white even:bg-gray-50'}>
                      <td>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">v{version.versionNumber}</span>
                          {getStatusBadge(version)}
                        </div>
                        {version.changeComment && (
                          <p className="text-xs text-gray-500 mt-1">{version.changeComment}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap">{formatFileSize(version.fileSize)}</td>
                      <td>{version.uploadedByName || 'Unknown'}</td>
                      <td className="whitespace-nowrap">{formatDate(version.createdAt)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDownload(version)}
                            className="btn-secondary !py-1 !px-2 text-xs"
                          >
                            Download
                          </button>
                          {canManage && !version.isCurrentVersion && (
                            <button
                              type="button"
                              onClick={() => handleRollback(version.versionNumber)}
                              className="btn-secondary !py-1 !px-2 text-xs"
                            >
                              Rollback
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteVersion(version.versionNumber)}
                              disabled={versions.length <= 1}
                              className={`btn-danger !py-1 !px-2 text-xs ${versions.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={versions.length <= 1 ? 'Cannot delete the only version' : ''}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          Showing {versions.length} version{versions.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default FileVersionHistory;
