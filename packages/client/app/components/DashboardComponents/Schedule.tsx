import { EventClickArg } from '@fullcalendar/core';
import { DateSelectArg } from '@fullcalendar/core';
import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface User {
  id: string;
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
  const [formSlot, setFormSlot] = useState<DateSelectArg | null>(null);
  const [formPosition, setFormPosition] = useState<{top: number, left: number}>({top: 0, left: 0});
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // Helper to render user dropdown
  const renderUserDropdown = () => {
    if (usersLoading) {
      return <div className="text-gray-500 text-sm">Loading users...</div>;
    }
    if (usersError) {
      return <div className="text-red-500 text-sm">{usersError}</div>;
    }
    // Ensure users is an array before mapping
    if (!Array.isArray(users)) {
      return <div className="text-red-500 text-sm">Unable to load users</div>;
    }
    return (
      <select
        className="border px-2 py-1 rounded w-full"
        value={selectedUser}
        onChange={e => setSelectedUser(e.target.value)}
        required
      >
        <option value="" disabled>Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {`${user.username} (${user.email})`}
          </option>
        ))}
      </select>
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
    }
    if (showForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForm]);

  // Handle date click (slot selection)
  const handleDateClick = (arg: DateSelectArg) => {
    setFormSlot(arg);
    setShowForm(true);
    setFormTitle('');
    setSelectedUser('');

    // Position the popup next to the clicked cell
    let top = 0, left = 0;
    if (arg.jsEvent && arg.start) {
      let slotCell: HTMLElement | null = null;
      try {
        const timeStr = arg.start.toTimeString().slice(0, 8);
        const dateStr = arg.start.toISOString().slice(0, 10);
        const headerCells = document.querySelectorAll('.fc-timegrid-col-header[data-date]');
        let dayIndex = -1;
        headerCells.forEach((header, index) => {
          if (header.getAttribute('data-date') === dateStr) {
            dayIndex = index;
          }
        });
        const timeRows = document.querySelectorAll('.fc-timegrid-slots tr[data-time]');
        let timeRow: Element | null = null;
        timeRows.forEach(row => {
          if(row.getAttribute('data-time') === timeStr) {
            timeRow = row;
          }
        });
        if (dayIndex !== -1 && timeRow) {
          const laneCells = (timeRow as Element).querySelectorAll('.fc-timegrid-slot-lane');
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
      left: Math.min(left, maxLeft)
    });
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formTitle || !selectedUser || !formSlot) return;
    
    const date = formSlot.startStr || '';
    const time = formSlot.startStr ? formSlot.startStr.split('T')[1]?.slice(0,5) : '00:00';
    
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, date, time, userId: selectedUser }),
      });
      
      if (res.ok) {
        const { schedule } = await res.json();
        
        // Refresh events from backend instead of manually adding
        await refreshEvents();
        
        // Show success message with Google Meet link
        if (schedule.googleMeetLink) {
          const showLink = window.confirm(
            `Meeting created successfully!\n\n` +
            `Google Meet link: ${schedule.googleMeetLink}\n\n` +
            `Click OK to open the meeting link, or Cancel to close this dialog.`
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
    setSelectedUser('');
  };

  // Handle event click to edit/delete
  const handleEventClick = async (arg: EventClickArg) => {
    const event = arg.event;
    const googleMeetLink = event.extendedProps?.googleMeetLink;
    
    let actionText = 'Type "edit" to edit, "delete" to delete this event';
    if (googleMeetLink) {
      actionText += ', or "join" to join Google Meet';
    }
    
    const action = prompt(actionText + ':', 'edit');
    
    if (action === 'join' && googleMeetLink) {
      window.open(googleMeetLink, '_blank');
      return;
    }
    
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this event?')) {
        try {
          const res = await fetch('/api/schedule', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: event.id }),
          });
          if (res.ok) {
            await refreshEvents(); // Refresh from backend
          }
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      }
    } else if (action === 'edit') {
      const newTitle = prompt('Enter new title:', event.title);
      if (!newTitle) return;
      try {
        const res = await fetch('/api/schedule', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: event.id,
            title: newTitle,
            date: event.startStr || event.start?.toISOString?.() || '',
            time: event.extendedProps?.time || '00:00',
            description: event.extendedProps?.description || '',
          }),
        });
        if (res.ok) {
          await refreshEvents(); // Refresh from backend
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
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
            dayHeaderFormat={{ weekday: 'long', day: '2-digit', month: 'short' }}
            eventContent={(arg) => {
              const hasGoogleMeet = arg.event.extendedProps?.googleMeetLink;
              return (
                <div style={{ padding: '2px 4px', fontSize: '12px', lineHeight: '1.2' }}>
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
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">With whom?</label>
                  {renderUserDropdown()}
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" className="px-2 py-1 text-gray-600" onClick={() => { setShowForm(false); setFormSlot(null); }}>Cancel</button>
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
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
