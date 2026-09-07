import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import DiscussionCard from './DiscussionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const DiscussionList = ({ projectId, projectTitle }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isStudentRoute = pathname.includes('/student');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' : 
                   isTeamLeaderRoute ? '/teamleader' : 
                   isStudentRoute ? '/student' : '/student';

  useEffect(() => {
    if (projectId) {
      fetchDiscussions();
    } else {
      setLoading(false);
      toast.error('Project ID is required');
    }
  }, [projectId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await discussionApi.getDiscussions(projectId);
      setDiscussions(response.data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = () => {
    // ✅ FIX: Pass projectId in navigation state as well
    navigate(`${basePath}/discussions/create?projectId=${projectId}`, {
      state: { projectId }
    });
  };

  const handleViewDiscussion = (discussionId) => {
    // ✅ FIX: Pass projectId in navigation state as well
    navigate(`${basePath}/discussions/${discussionId}?projectId=${projectId}`, {
      state: { projectId }
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Discussions</h2>
          {projectTitle && (
            <p className="text-sm text-gray-600">
              {projectTitle} • {discussions.length} discussion{discussions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={handleCreateDiscussion}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Discussion
        </button>
      </div>

      {/* Discussions List */}
      {discussions.length === 0 ? (
        <EmptyState
          title="No Discussions Yet"
          description="Start a conversation about your project. Discuss ideas, share updates, and collaborate with your team."
          actionText="Start a Discussion"
          actionLink={`${basePath}/discussions/create?projectId=${projectId}`}
          icon="💬"
        />
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.discussionId}
              discussion={discussion}
              onView={handleViewDiscussion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;