import api from './axios';

const fileApi = {
  // Download file
  downloadFile: (fileId) => {
    return api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
  },

  // View file (preview)
  viewFile: (fileId) => {
    return api.get(`/files/view/${fileId}`, {
      responseType: 'blob',
    });
  },

  // Get file info
  getFileInfo: (fileId) => {
    return api.get(`/files/${fileId}/info`);
  },

  // Get file versions
  getFileVersions: (fileId) => {
    return api.get(`/files/${fileId}/versions`);
  },

  // Upload new version
  uploadVersion: (fileId, file, changeComment) => {
    const formData = new FormData();
    formData.append('file', file);
    if (changeComment) {
      formData.append('changeComment', changeComment);
    }
    return api.post(`/files/${fileId}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download specific version
  downloadVersion: (fileId, versionNumber) => {
    return api.get(`/files/${fileId}/versions/${versionNumber}/download`, {
      responseType: 'blob',
    });
  },

  // Rollback to version
  rollbackToVersion: (fileId, versionNumber, reason) => {
    return api.post(`/files/${fileId}/rollback/${versionNumber}?reason=${encodeURIComponent(reason || '')}`);
  },

  // Delete version
  deleteVersion: (fileId, versionNumber) => {
    return api.delete(`/files/${fileId}/versions/${versionNumber}`);
  },

  // Compare versions
  compareVersions: (fileId, v1, v2) => {
    return api.get(`/files/${fileId}/compare?v1=${v1}&v2=${v2}`);
  },
};

export default fileApi;