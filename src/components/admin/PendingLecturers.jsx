import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PendingLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Lecturer Registrations</h1>
          <p className="text-gray-600">Review and verify new lecturer accounts</p>
        </div>
        <span className="mt-2 sm:mt-0 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          {lecturers.length} pending
        </span>
      </div>

      {lecturers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Registrations</h3>
          <p className="text-gray-500">All lecturer registrations have been processed</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lecturers.map((lecturer) => (
                  <tr key={lecturer.userId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {lecturer.firstName?.charAt(0)}{lecturer.lastName?.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {lecturer.firstName} {lecturer.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">@{lecturer.username}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.studentId || '—'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lecturer.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(lecturer.userId)}
                          className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(lecturer.userId)}
                          className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
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