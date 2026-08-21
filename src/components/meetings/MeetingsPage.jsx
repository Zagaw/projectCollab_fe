import React, { useState } from 'react';
import MeetingList from './MeetingList';
import CreateMeeting from './CreateMeeting';
import MeetingDetails from './MeetingDetails';

const MeetingsPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'details'
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Initial meeting state
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Database Schema & Architecture Sync',
      description: 'Review foreign key indexing strategy and discuss system performance bottlenecks.',
      date: '2026-08-25',
      time: '14:00',
      location: 'https://meet.google.com/abc-defg-hij',
      isVirtual: true,
      status: 'upcoming',
      attendees: ['Aung Ko', 'Dr. Kyaw Swar', 'Student User'],
      minutes: 'Initial agreement on adding composite index to project_id.',
    },
    {
      id: '2',
      title: 'Sprint Review & Demo',
      description: 'Demonstrating file upload component and nested comments integration.',
      date: '2026-08-20',
      time: '10:30',
      location: 'Room 302, Building B',
      isVirtual: false,
      status: 'completed',
      attendees: ['Lecturer', 'Student User'],
      minutes: 'Demo completed successfully. Finalized UI layout.',
    },
  ]);

  const handleCreateMeeting = (newMeeting) => {
    const meetingWithId = { ...newMeeting, id: Date.now().toString(), status: 'upcoming' };
    setMeetings((prev) => [meetingWithId, ...prev]);
    setView('list');
  };

  const handleDeleteMeeting = (id) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (selectedMeeting?.id === id) {
      setSelectedMeeting(null);
      setView('list');
    }
  };

  const handleSaveMinutes = (id, newMinutes) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, minutes: newMinutes } : m))
    );
    if (selectedMeeting?.id === id) {
      setSelectedMeeting((prev) => ({ ...prev, minutes: newMinutes }));
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setView('details');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {view === 'list' && (
        <MeetingList
          meetings={meetings}
          onSelect={handleSelectMeeting}
          onDelete={handleDeleteMeeting}
          onCreateClick={() => setView('create')}
        />
      )}

      {view === 'create' && (
        <CreateMeeting
          onSubmit={handleCreateMeeting}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'details' && selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          onBack={() => setView('list')}
          onSaveMinutes={handleSaveMinutes}
        />
      )}
    </div>
  );
};

export default MeetingsPage;