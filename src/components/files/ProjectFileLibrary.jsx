import React, { useEffect, useRef, useState } from 'react';
import fileApi from '../../api/fileApi';
import teamApi from '../../api/teamApi';
import { useAuth } from '../../context/AuthContext';
import FileAttachment from './FileAttachment';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'GENERAL', label: 'General' },
  { id: 'REPORT', label: 'Report' },
  { id: 'DESIGN', label: 'Design' },
  { id: 'SUBMISSION', label: 'Submission' },
];

const ProjectFileLibrary = ({ projectId, teamId, teams: teamsProp }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState(teamsProp || []);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [filterTeamId, setFilterTeamId] = useState(teamId ? String(teamId) : 'ALL');
  const [uploadCategory, setUploadCategory] = useState('GENERAL');
  const [uploadTeamId, setUploadTeamId] = useState(teamId ? String(teamId) : '');
  const fileInputRef = useRef(null);

  const isLecturerOrAdmin = user?.role === 'LECTURER' || user?.role === 'ADMIN';

  useEffect(() => {
    if (teamsProp && teamsProp.length) {
      setTeams(teamsProp);
      return;
    }
    if (projectId) {
      teamApi.getTeamsByProject(projectId)
        .then((response) => setTeams(response.data || []))
        .catch(() => setTeams([]));
    }
  }, [projectId, teamsProp]);

  useEffect(() => {
    if (!uploadTeamId && teams.length && user?.userId && !isLecturerOrAdmin) {
      const mine = teams.find((team) =>
        (team.members || []).some((member) => String(member.userId) === String(user.userId))
        || String(team.teamLeader?.userId) === String(user.userId)
      );
      if (mine) {
        setUploadTeamId(String(mine.teamId));
      } else if (teams.length === 1) {
        setUploadTeamId(String(teams[0].teamId));
      }
    }
  }, [teams, user, uploadTeamId, isLecturerOrAdmin]);

  useEffect(() => {
    if (projectId || teamId) {
      fetchFiles();
    }
  }, [projectId, teamId, category, filterTeamId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'ALL') {
        params.category = category;
      }
      const selectedTeam = teamId || (filterTeamId !== 'ALL' ? filterTeamId : null);
      if (selectedTeam) {
        params.teamId = selectedTeam;
      }
      const response = projectId
        ? await fileApi.getProjectFiles(projectId, params)
        : await fileApi.getTeamFiles(teamId, params);
      setFiles(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!projectId && !teamId) {
      toast.error('Select a project first');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleUpload = async (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    try {
      setUploading(true);
      const teamForUpload = teamId || uploadTeamId || undefined;
      if (projectId) {
        await fileApi.uploadProjectFile(projectId, selected, uploadCategory, teamForUpload);
      } else {
        await fileApi.uploadTeamFile(teamId, selected, uploadCategory);
      }
      toast.success('File uploaded');
      await fetchFiles();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload file. Restart the backend if this is the first upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (fileId) => {
    await fileApi.deleteFile(fileId);
    setFiles((prev) => prev.filter((file) => file.fileId !== fileId));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        This library is for shared project documents (reports, designs, submissions).
        Files attached to a <span className="font-medium">task comment</span> stay on that task — they do not appear here.
      </p>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                category === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {projectId && teams.length > 0 && (
          <select
            value={filterTeamId}
            onChange={(e) => setFilterTeamId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="ALL">All teams</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
        {projectId && teams.length > 0 && (
          <select
            value={uploadTeamId}
            onChange={(e) => setUploadTeamId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {isLecturerOrAdmin && <option value="">Project-wide (all teams)</option>}
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={uploadCategory}
          onChange={(e) => setUploadCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          {CATEGORIES.filter((item) => item.id !== 'ALL').map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading || (!projectId && !teamId)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload file'}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : files.length === 0 ? (
        <EmptyState
          title="No Files Yet"
          description="Use Upload file above to add a report, design, or submission for this project."
        />
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.fileId}>
              <div className="flex flex-wrap gap-1 mb-1">
                {file.teamName && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700">
                    {file.teamName}
                  </span>
                )}
                {!file.teamName && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    Project-wide
                  </span>
                )}
                {file.category && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    {file.category}
                  </span>
                )}
              </div>
              <FileAttachment
                file={file}
                onDelete={handleDelete}
                onVersionUpdated={fetchFiles}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectFileLibrary;
