import { EventClickArg } from '@fullcalendar/core';
import { DateSelectArg } from '@fullcalendar/core';
import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface EventDetails {
  id: string;
  title: string;
  start: Date | null;
  end: Date | null;
  googleMeetLink?: string;
  time?: string;
  description?: string;
  userId?: string | number;
  participants?: User[];
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  userId?: string;
  googleMeetLink?: string;
  extendedProps?: Record<string, unknown>;
}

function Schedule() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSlot, setFormSlot] = useState<DateSelectArg | null>(null);
  const [formPosition, setFormPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [eventPosition, setEventPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [meetingStatus, setMeetingStatus] = useState<
    'pending' | 'approved' | 'rejected'
  >('pending');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [editParticipants, setEditParticipants] = useState<User[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const eventDetailsRef = useRef<HTMLDivElement>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  // Helper functions for participant management
  const addParticipant = (userId: string | number, isEditMode = false) => {
    console.log('Adding participant:', userId, 'isEditMode:', isEditMode);
    // Convert both to numbers for comparison
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
    const user = users.find((u) => u.id === userIdNum);
    if (!user) {
      console.log(
        'User not found:',
        userId,
        'Available users:',
        users.map((u) => ({ id: u.id, username: u.username })),
      );
      return;
    }

    if (isEditMode) {
      if (!editParticipants.find((p) => p.id === userIdNum)) {
        console.log('Adding to edit participants:', user);
        setEditParticipants([...editParticipants, user]);
      }
    } else {
      if (!selectedParticipants.find((p) => p.id === userIdNum)) {
        console.log('Adding to selected participants:', user);
        setSelectedParticipants([...selectedParticipants, user]);
      }
    }
    setSelectedUser(''); // Reset dropdown
  };

  const removeParticipant = (userId: string | number, isEditMode = false) => {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
    if (isEditMode) {
      setEditParticipants(editParticipants.filter((p) => p.id !== userIdNum));
    } else {
      setSelectedParticipants(
        selectedParticipants.filter((p) => p.id !== userIdNum),
      );
    }
  };

  // Render participants list with add/remove functionality
  const renderParticipantsList = (participants: User[], isEditMode = false) => {
    return (
      <div className="space-y-2">
        {participants.length > 0 && (
          <div className="space-y-1">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between bg-blue-50 rounded-lg p-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">👤</span>
                  <span className="text-sm font-medium text-blue-800">
                    {participant.username}
                  </span>
                  <span className="text-xs text-blue-600">
                    ({participant.email})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeParticipant(participant.id, isEditMode)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <select
            className={`flex-1 px-2 py-1 text-sm border border-gray-300 rounded ${
              isEditMode ? 'focus:ring-2 focus:ring-blue-500' : ''
            }`}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Add participant...</option>
            {users
              .filter((user) => !participants.find((p) => p.id === user.id))
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.username} (${user.email})`}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={() =>
              selectedUser && addParticipant(selectedUser, isEditMode)
            }
            disabled={!selectedUser}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Add
          </button>
        </div>

        {participants.length === 0 && (
          <p className="text-gray-500 text-sm italic">
            No participants added yet
          </p>
        )}
      </div>
    );
  };

  // Function to refresh events from backend
  const refreshEvents = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      console.log('Refreshed schedule data:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/schedule')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched schedule data:', data); // Debug log
        setEvents(data); // Data is already in the correct format from backend
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setUsersLoading(true);
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        // Check if data is an array and has the expected structure
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          // If data is not an array, it might be an error response
          console.error('Users API response is not an array:', data);
          setUsersError(data.error || 'Failed to load users');
        }
        setUsersLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setUsersError('Failed to load users');
        setUsersLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
        setFormSlot(null);
      }
      if (
        eventDetailsRef.current &&
        !eventDetailsRef.current.contains(event.target as Node)
      ) {
        setShowEventDetails(false);
        setSelectedEvent(null);
      }
      if (
        editFormRef.current &&
        !editFormRef.current.contains(event.target as Node)
      ) {
        setShowEditForm(false);
        setSelectedEvent(null);
      }
    }
    if (showForm || showEventDetails || showEditForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForm, showEventDetails, showEditForm]);

  // Handle date click (slot selection)
  const handleDateClick = (arg: DateSelectArg) => {
    setFormSlot(arg);
    setShowForm(true);
    setFormTitle('');
    setFormDescription('');
    setSelectedParticipants([]);
    setSelectedUser('');

    // Position the popup next to the clicked cell
    let top = 0,
      left = 0;
    if (arg.jsEvent && arg.start) {
      let slotCell: HTMLElement | null = null;
      try {
        const timeStr = arg.start.toTimeString().slice(0, 8);
        const dateStr = arg.start.toISOString().slice(0, 10);
        const headerCells = document.querySelectorAll(
          '.fc-timegrid-col-header[data-date]',
        );
        let dayIndex = -1;
        headerCells.forEach((header, index) => {
          if (header.getAttribute('data-date') === dateStr) {
            dayIndex = index;
          }
        });
        const timeRows = document.querySelectorAll(
          '.fc-timegrid-slots tr[data-time]',
        );
        let timeRow: Element | null = null;
        timeRows.forEach((row) => {
          if (row.getAttribute('data-time') === timeStr) {
            timeRow = row;
          }
        });
        if (dayIndex !== -1 && timeRow) {
          const laneCells = (timeRow as Element).querySelectorAll(
            '.fc-timegrid-slot-lane',
          );
          if (laneCells && laneCells[dayIndex]) {
            slotCell = laneCells[dayIndex] as HTMLElement;
          }
        }
        if (slotCell) {
          const rect = slotCell.getBoundingClientRect();
          top = rect.top + window.scrollY;
          left = rect.left + window.scrollX;
        }
      } catch {
        top = arg.jsEvent.clientY + window.scrollY;
        left = arg.jsEvent.clientX + window.scrollX;
      }
    } else if (arg.jsEvent) {
      top = arg.jsEvent.clientY + window.scrollY;
      left = arg.jsEvent.clientX + window.scrollX;
    }
    const formHeight = 250;
    const formWidth = 240;
    const maxTop = window.innerHeight + window.scrollY - formHeight;
    const maxLeft = window.innerWidth + window.scrollX - formWidth;
    setFormPosition({
      top: Math.min(top, maxTop),
      left: Math.min(left, maxLeft),
    });
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission:', {
      formTitle,
      selectedParticipants,
      formSlot,
    });

    if (!formTitle || !formSlot) {
      console.log('Form validation failed:', {
        hasTitle: !!formTitle,
        hasSlot: !!formSlot,
      });
      alert('Please fill in the title and select a time slot.');
      return;
    }

    // Allow meetings without participants for now
    if (selectedParticipants.length === 0) {
      console.log('Warning: No participants selected');
    }

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          start: formSlot.startStr,
          end: formSlot.endStr,
          description: formDescription.trim() || undefined,
          participants: selectedParticipants.map((p) => p.id),
        }),
      });

      if (res.ok) {
        const { schedule } = await res.json();

        // Refresh events from backend instead of manually adding
        await refreshEvents();

        // Show success message with Google Meet link
        if (schedule.googleMeetLink) {
          const participantCount = selectedParticipants.length;
          const showLink = window.confirm(
            `Meeting created successfully${participantCount > 0 ? ` with ${participantCount} participant(s)` : ''}!\n\n` +
              `🎥 Google Meet link: ${schedule.googleMeetLink}\n\n` +
              `This is a real Google Meet link that participants can join directly. ` +
              `${participantCount > 0 ? 'Calendar invitations have been sent to all participants.' : ''}\n\n` +
              `Click OK to open the Google Meet link, or Cancel to close this dialog.`,
          );

          if (showLink) {
            window.open(schedule.googleMeetLink, '_blank');
          }
        }
      } else {
        console.error('Failed to create schedule');
        alert('Failed to create meeting. Please try again.');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create meeting. Please try again.');
    }

    setShowForm(false);
    setFormSlot(null);
    setFormTitle('');
    setFormDescription('');
    setSelectedParticipants([]);
  };

  // Handle event click to show details popup
  const handleEventClick = async (arg: EventClickArg) => {
    const event = arg.event;

    // Position the popup next to the clicked event
    let top = 0,
      left = 0;
    if (arg.jsEvent) {
      top = arg.jsEvent.clientY + window.scrollY;
      left = arg.jsEvent.clientX + window.scrollX;
    }

    // Adjust position to keep popup in viewport
    const popupHeight = 400;
    const popupWidth = 320;
    const maxTop = window.innerHeight + window.scrollY - popupHeight;
    const maxLeft = window.innerWidth + window.scrollX - popupWidth;

    setEventPosition({
      top: Math.min(top, maxTop),
      left: Math.min(left, maxLeft),
    });

    // Set event details
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      googleMeetLink: event.extendedProps?.googleMeetLink,
      time: event.extendedProps?.time,
      description: event.extendedProps?.description,
      userId: event.extendedProps?.userId,
      participants: event.extendedProps?.participants || [],
    });

    // Set the actual status from backend
    setMeetingStatus(event.extendedProps?.status || 'pending');

    setShowEventDetails(true);
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        const res = await fetch('/api/schedule', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedEvent.id }),
        });
        if (res.ok) {
          await refreshEvents();
          setShowEventDetails(false);
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete meeting. Please try again.');
      }
    }
  };

  // Handle joining Google Meet
  const handleJoinMeeting = () => {
    if (selectedEvent?.googleMeetLink) {
      window.open(selectedEvent.googleMeetLink, '_blank');
    }
  };

  // Handle starting edit mode
  const handleStartEdit = () => {
    if (!selectedEvent) return;

    setEditTitle(selectedEvent.title);
    setEditDescription(selectedEvent.description || '');

    // Use start and end as ISO strings if available
    if (selectedEvent.start && selectedEvent.end) {
      // If start/end are Date objects, convert to ISO string for datetime-local input
      const startISO =
        typeof selectedEvent.start === 'string'
          ? selectedEvent.start
          : selectedEvent.start.toISOString();
      const endISO =
        typeof selectedEvent.end === 'string'
          ? selectedEvent.end
          : selectedEvent.end.toISOString();
      setEditStartTime(startISO.slice(0, 16));
      setEditEndTime(endISO.slice(0, 16));
    } else {
      // Fallback to current date/time
      const now = new Date();
      setEditStartTime(now.toISOString().slice(0, 16));
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setEditEndTime(oneHourLater.toISOString().slice(0, 16));
    }

    // Prefill participants with the event's participants if available
    if (selectedEvent.participants && selectedEvent.participants.length > 0) {
      // If participants are missing user details, map to full user objects from users list
      const fullParticipants = selectedEvent.participants
        .map((p) => {
          if (typeof p === 'object' && p.username && p.email) {
            return p;
          }
          // fallback: find user by id
          const userObj = users.find(
            (u) => u.id === (typeof p === 'object' ? p.id : p),
          );
          return userObj ? userObj : p;
        })
        .filter(Boolean);
      setEditParticipants(fullParticipants);
    } else {
      setEditParticipants([]);
    }
    setShowEventDetails(false);
    setShowEditForm(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent || !editTitle.trim() || !editStartTime || !editEndTime) {
      alert('Please fill in all required fields.');
      return;
    }

    // Allow meetings without participants for now
    if (editParticipants.length === 0) {
      console.log('Warning: No participants in edit mode');
    }

    try {
      const res = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEvent.id,
          title: editTitle.trim(),
          start: editStartTime,
          end: editEndTime,
          participants: editParticipants.map((p) => p.id),
          description: editDescription.trim() || '',
        }),
      });

      if (res.ok) {
        await refreshEvents();
        setShowEditForm(false);
        setSelectedEvent(null);
        setEditTitle('');
        setEditDescription('');
        setEditStartTime('');
        setEditEndTime('');
        setEditParticipants([]);

        alert(
          `Meeting updated successfully! ${editParticipants.length} participant(s) have been notified of the changes.`,
        );
      } else {
        console.error('Failed to update meeting');
        alert('Failed to update meeting. Please try again.');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
      alert('Failed to update meeting. Please try again.');
    }
  };

  // Handle edit form cancellation
  const handleEditCancel = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
    setEditTitle('');
    setEditDescription('');
    setEditStartTime('');
    setEditEndTime('');
    setEditParticipants([]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <div style={{ position: 'relative' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            slotDuration="00:30:00"
            slotLabelInterval="00:30"
            allDaySlot={false}
            firstDay={1}
            selectable={true}
            selectMirror={true}
            select={handleDateClick}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            dayHeaderFormat={{
              weekday: 'long',
              day: '2-digit',
              month: 'short',
            }}
            eventContent={(arg) => {
              const hasGoogleMeet = arg.event.extendedProps?.googleMeetLink;
              return (
                <div
                  style={{
                    padding: '2px 4px',
                    fontSize: '12px',
                    lineHeight: '1.2',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>
                    {hasGoogleMeet && '🎥 '}
                    {arg.event.title}
                  </div>
                  {hasGoogleMeet && (
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                      Google Meet
                    </div>
                  )}
                </div>
              );
            }}
          />
          {showForm && formSlot && (
            <div
              ref={formRef}
              style={{
                position: 'absolute',
                left: formPosition.left,
                top: formPosition.top,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 12,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                minWidth: 240,
              }}
            >
              <form onSubmit={handleFormSubmit}>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Event Title
                  </label>
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    className="border px-2 py-1 rounded w-full text-sm"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    placeholder="Add meeting description..."
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Participants
                  </label>
                  {usersLoading ? (
                    <div className="text-gray-500 text-sm">
                      Loading users...
                    </div>
                  ) : usersError ? (
                    <div className="text-red-500 text-sm">{usersError}</div>
                  ) : (
                    renderParticipantsList(selectedParticipants, false)
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-2 py-1 text-gray-600"
                    onClick={() => {
                      setShowForm(false);
                      setFormSlot(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Event Details Popup */}
          {showEventDetails && selectedEvent && (
            <div
              ref={eventDetailsRef}
              style={{
                position: 'absolute',
                left: eventPosition.left,
                top: eventPosition.top,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 16,
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: 320,
                maxWidth: 400,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Meeting Details
                </h3>
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Title:
                  </span>
                  <p className="text-gray-800">{selectedEvent.title}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Date & Time:
                  </span>
                  <p className="text-gray-800">
                    {selectedEvent.start?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {selectedEvent.time || 'N/A'}
                  </p>
                </div>

                {selectedEvent.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Description:
                    </span>
                    <p className="text-gray-800">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.participants &&
                  selectedEvent.participants.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Participants:
                      </span>
                      <div className="mt-1">
                        {selectedEvent.participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2 mb-1"
                          >
                            👤 {participant.username}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      meetingStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : meetingStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {meetingStatus.charAt(0).toUpperCase() +
                      meetingStatus.slice(1)}
                  </span>
                </div>

                {selectedEvent.googleMeetLink && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Meeting Link:
                    </span>
                    <button
                      onClick={handleJoinMeeting}
                      className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      🎥 Join Google Meet
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to join the video meeting directly
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Edit Form Popup */}
          {showEditForm && selectedEvent && (
            <div
              ref={editFormRef}
              style={{
                position: 'absolute',
                left: eventPosition.left,
                top: eventPosition.top,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 16,
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: 320,
                maxWidth: 400,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit Meeting
                </h3>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add meeting description..."
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={editStartTime || new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Participants
                  </label>
                  {usersLoading ? (
                    <div className="text-gray-500 text-sm">
                      Loading users...
                    </div>
                  ) : usersError ? (
                    <div className="text-red-500 text-sm">{usersError}</div>
                  ) : (
                    renderParticipantsList(editParticipants, true)
                  )}
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Schedule;
