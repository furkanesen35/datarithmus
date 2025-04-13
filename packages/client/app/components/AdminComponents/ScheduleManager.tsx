"use client";
import { useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

interface ScheduleManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function ScheduleManager({ onMessage, onError }: ScheduleManagerProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventTime || !eventDescription) {
      onError("Title, date, time, and description are required");
      return;
    }

    if (editingId) {
      // Edit existing event
      setEvents(
        events.map((ev) =>
          ev.id === editingId
            ? { ...ev, title: eventTitle, date: eventDate, time: eventTime, description: eventDescription }
            : ev
        )
      );
      onMessage("Event updated successfully");
      setEditingId(null);
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now(),
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        createdAt: new Date().toISOString(),
      };
      setEvents([newEvent, ...events]);
      onMessage("Event created successfully");
    }

    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventDescription("");
  };

  const handleEdit = (ev: Event) => {
    setEditingId(ev.id);
    setEventTitle(ev.title);
    setEventDate(ev.date);
    setEventTime(ev.time);
    setEventDescription(ev.description);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((ev) => ev.id !== id));
    onMessage("Event deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Event" : "Schedule Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventTitle" className="block text-sm font-medium">
            Event Title
          </label>
          <input
            type="text"
            id="eventTitle"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="eventTime" className="block text-sm font-medium">
            Time
          </label>
          <input
            type="time"
            id="eventTime"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="eventDescription" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Event" : "Schedule Event"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setEventTitle("");
                setEventDate("");
                setEventTime("");
                setEventDescription("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Scheduled Events</h3>
        {events.length === 0 ? (
          <p>No events scheduled yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((ev) => (
              <li key={ev.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{ev.title}</h4>
                <p className="text-sm">Date: {new Date(ev.date).toLocaleDateString()}</p>
                <p className="text-sm">Time: {ev.time}</p>
                <p className="text-sm">{ev.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(ev.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}