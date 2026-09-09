import React, { useState, useEffect } from 'react';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAllProjects();
      setProjects(response.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL'
    ? projects
    : projects.filter((p) => p.status === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
        <p className="text-gray-600">Every academic project in the system</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'ALL' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-500">No projects match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Lecturer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Teams</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">End date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.projectId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.semester}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.course}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.lecturerName}
                      <p className="text-xs text-gray-400">{project.lecturerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.teamCount || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectList;
