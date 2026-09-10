import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import meetingApi from '../../api/meetingApi';
import { formatMeetingTime } from './meetingUtils';

const UpcomingMeetings = ({ source = 'my', basePath }) => {
  const [meetings, setMeetings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = source === 'lecturer'
          ? await meetingApi.getLecturerMeetings('upcoming')
          : await meetingApi.getMyMeetings('upcoming');
        setMeetings((response.data || []).slice(0, 3));
      } catch (error) {
        setMeetings([]);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [source]);

  if (!loaded) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming meetings</h2>
        <div className="flex items-center gap-3 shrink-0">
          {basePath !== '/lecturer' && (
            <Link to={`${basePath}/calendar`} className="text-sm text-indigo-600 hover:text-indigo-700">
              Calendar
            </Link>
          )}
          <Link to={`${basePath}/meetings`} className="text-sm text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
      </div>
      {meetings.length > 0 ? (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <Link
              key={meeting.meetingId}
              to={`${basePath}/meetings/${meeting.meetingId}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-900">{meeting.title}</p>
              <p className="text-sm text-gray-500">
                {meeting.teamName} • {meeting.projectTitle}
              </p>
              <p className="text-xs text-indigo-600 mt-1">{formatMeetingTime(meeting.startAt)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No upcoming meetings.</p>
      )}
    </div>
  );
};

export default UpcomingMeetings;
