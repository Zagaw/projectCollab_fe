import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';

const PendingLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPendingLecturers();
  }, []);

  const fetchPendingLecturers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pending-lecturers');
      setLecturers(response.data);
    } catch (error) {
      toast.error('Failed to load pending lecturers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.put(`/admin/verify-lecturer/${userId}`);
      toast.success('Lecturer verified successfully');
      fetchPendingLecturers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to verify lecturer');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this lecturer registration?')) return;
    
    try {
      await api.put(`/admin/reject-lecturer/${userId}`);
      toast.success('Lecturer registration rejected');
      fetchPendingLecturers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject lecturer');
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return lecturers;
    return lecturers.filter((lecturer) =>
      lecturer.firstName?.toLowerCase().includes(term) ||
      lecturer.lastName?.toLowerCase().includes(term) ||
      lecturer.email?.toLowerCase().includes(term) ||
      lecturer.username?.toLowerCase().includes(term)
    );
  }, [lecturers, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pending lecturers"
        description="Review and verify new lecturer accounts."
        actions={
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800">
            {lecturers.length} pending
          </span>
        }
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="field max-w-md"
      />

      {lecturers.length === 0 ? (
        <EmptyState
          title="No pending registrations"
          description="All lecturer registrations have been processed."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching lecturers"
          description="Try a different search term."
        />
      ) : (
        <div className="surface">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lecturer) => (
                  <tr key={lecturer.userId} className="border-b border-gray-100 last:border-0">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-indigo-700 font-semibold text-sm">
                            {lecturer.firstName?.charAt(0)}{lecturer.lastName?.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">
                          {lecturer.firstName} {lecturer.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="text-gray-600">@{lecturer.username}</td>
                    <td className="text-gray-600">{lecturer.email}</td>
                    <td className="text-gray-600">{lecturer.studentId || '—'}</td>
                    <td className="text-gray-600">{lecturer.phone || '—'}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleVerify(lecturer.userId)}
                          className="btn-primary !py-1.5 !px-3"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(lecturer.userId)}
                          className="btn-danger !py-1.5 !px-3"
                        >
                          Reject
                        </button>
                      </div>
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

export default PendingLecturers;
