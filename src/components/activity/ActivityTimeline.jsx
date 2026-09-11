import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import activityApi from '../../api/activityApi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import toast from 'react-hot-toast';

const getBasePath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes('/lecturer')) return '/lecturer';
  if (pathname.includes('/teamleader')) return '/teamleader';
  if (pathname.includes('/admin')) return '/admin';
  return '/student';
};

const activityLink = (activity, basePath) => {
  const type = activity.entityType;
  const id = activity.entityId;
  const projectId = activity.projectId;

  if (type === 'TASK' && id) return `${basePath}/tasks/${id}`;
  if (type === 'MILESTONE' && id) return `${basePath}/milestones/${id}`;
  if (type === 'TEAM' && id) return `${basePath}/teams/${id}`;
  if (type === 'MEETING' && id) return `${basePath}/meetings/${id}`;
  if (type === 'DISCUSSION' && id) {
    return `${basePath}/discussions/${id}${projectId ? `?projectId=${projectId}` : ''}`;
  }
  if (projectId) return `${basePath}/projects/${projectId}`;
  return null;
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString();
};

const ActivityTimeline = ({ projectId, limit = 50, compact = false }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const basePath = getBasePath();

  useEffect(() => {
    fetchActivities();
  }, [projectId, limit]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = projectId
        ? await activityApi.getProjectActivities(projectId, limit)
        : await activityApi.getMyActivities(limit);
      setActivities(response.data || []);
    } catch (error) {
      toast.error('Failed to load activity');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (activity) => {
    const path = activityLink(activity, basePath);
    if (path) {
      navigate(path);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (activities.length === 0) {
    if (compact) {
      return <p className="text-sm text-gray-500">No recent activity.</p>;
    }
    return (
      <EmptyState
        title="No activity yet"
        description="Project actions like tasks, comments, and file uploads will appear here."
      />
    );
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {activities.map((activity) => {
        const path = activityLink(activity, basePath);
        return (
          <button
            key={activity.activityId}
            type="button"
            onClick={() => handleClick(activity)}
            disabled={!path}
            className={`w-full text-left surface p-3 transition ${
              path ? 'hover:border-indigo-200 cursor-pointer' : 'cursor-default'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-ink text-sm">
                  {activity.userName}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                {!compact && activity.projectTitle && (
                  <p className="text-xs text-gray-500 mt-1">{activity.projectTitle}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(activity.createdAt)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
