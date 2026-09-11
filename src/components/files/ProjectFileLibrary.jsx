import React, { useEffect, useRef, useState } from 'react';
import fileApi from '../../api/fileApi';
import teamApi from '../../api/teamApi';
import { useAuth } from '../../context/AuthContext';
import FileAttachment from './FileAttachment';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { Files, Upload } from 'lucide-react';

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
        Files attached to a <span className="font-medium text-ink">task comment</span> stay on that task — they do not appear here.
      </p>

      <div className="surface p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <FilterChips
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
          />

          {projectId && teams.length > 0 && (
            <select
              value={filterTeamId}
              onChange={(e) => setFilterTeamId(e.target.value)}
              className="field max-w-xs"
              aria-label="Filter by team"
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

        <div className="flex flex-wrap items-end gap-2 pt-1 border-t border-gray-100">
          {projectId && teams.length > 0 && (
            <div>
              <label className="label" htmlFor="file-upload-team">Upload to</label>
              <select
                id="file-upload-team"
                value={uploadTeamId}
                onChange={(e) => setUploadTeamId(e.target.value)}
                className="field"
              >
                {isLecturerOrAdmin && <option value="">Project-wide (all teams)</option>}
                {teams.map((team) => (
                  <option key={team.teamId} value={team.teamId}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label" htmlFor="file-upload-category">Category</label>
            <select
              id="file-upload-category"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="field"
            >
              {CATEGORIES.filter((item) => item.id !== 'ALL').map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
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
            className="btn-primary"
          >
            <Upload className="w-4 h-4" strokeWidth={2} />
            {uploading ? 'Uploading...' : 'Upload file'}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : files.length === 0 ? (
        <EmptyState
          icon={Files}
          title="No files yet"
          description="Use Upload file above to add a report, design, or submission for this project."
        />
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.fileId} className="space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {file.teamName ? (
                  <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">{file.teamName}</span>
                ) : (
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">Project-wide</span>
                )}
                {file.category && (
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{file.category}</span>
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
