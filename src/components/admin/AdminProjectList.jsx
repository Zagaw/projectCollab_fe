import React, { useState, useEffect, useMemo } from 'react';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';

const STATUS_LABEL = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On hold',
  CANCELLED: 'Cancelled',
};

const AdminProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

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

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return projects.filter((p) => {
      const statusOk = filter === 'ALL' || p.status === filter;
      const searchOk = !term ||
        p.title?.toLowerCase().includes(term) ||
        p.course?.toLowerCase().includes(term) ||
        p.lecturerName?.toLowerCase().includes(term) ||
        p.semester?.toLowerCase().includes(term);
      return statusOk && searchOk;
    });
  }, [projects, filter, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="All projects"
        description="Every academic project in the system."
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title, course, or lecturer..."
        className="field max-w-md"
      />

      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { id: 'ALL', label: 'All', count: projects.length },
          { id: 'ACTIVE', label: 'Active', count: projects.filter((p) => p.status === 'ACTIVE').length },
          { id: 'COMPLETED', label: 'Completed', count: projects.filter((p) => p.status === 'COMPLETED').length },
          { id: 'ON_HOLD', label: 'On hold', count: projects.filter((p) => p.status === 'ON_HOLD').length },
          { id: 'CANCELLED', label: 'Cancelled', count: projects.filter((p) => p.status === 'CANCELLED').length },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="No projects match this filter."
        />
      ) : (
        <div className="surface">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>Project</th>
                  <th>Course</th>
                  <th>Lecturer</th>
                  <th>Teams</th>
                  <th>Status</th>
                  <th>End date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.projectId} className="border-b border-gray-100 last:border-0">
                    <td>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.semester}</p>
                    </td>
                    <td className="text-gray-600">{project.course}</td>
                    <td className="text-gray-600">
                      {project.lecturerName}
                      <p className="text-xs text-gray-500">{project.lecturerEmail}</p>
                    </td>
                    <td className="text-gray-600">{project.teamCount || 0}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === 'ACTIVE' ? 'bg-green-50 text-green-800' :
                        project.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-800' :
                        project.status === 'ON_HOLD' ? 'bg-amber-50 text-amber-800' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {STATUS_LABEL[project.status] || project.status}
                      </span>
                    </td>
                    <td className="text-gray-600">
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
