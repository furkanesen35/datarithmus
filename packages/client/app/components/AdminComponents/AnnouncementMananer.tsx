"use client";
import { useState } from "react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface AnnouncementsManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function AnnouncementsManager({ onMessage, onError }: AnnouncementsManagerProps) {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) {
      onError("Title and content are required");
      return;
    }

    if (editingId) {
      // Edit existing announcement
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingId
            ? { ...ann, title: announcementTitle, content: announcementContent }
            : ann
        )
      );
      onMessage("Announcement updated successfully");
      setEditingId(null);
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now(),
        title: announcementTitle,
        content: announcementContent,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      onMessage("Announcement created successfully");
    }

    setAnnouncementTitle("");
    setAnnouncementContent("");
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setAnnouncementTitle(ann.title);
    setAnnouncementContent(ann.content);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
    onMessage("Announcement deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Announcement" : "Create Announcement"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="announcementTitle" className="block text-sm font-medium">
            Announcement Title
          </label>
          <input
            type="text"
            id="announcementTitle"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="announcementContent" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="announcementContent"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={5}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Announcement" : "Create Announcement"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setAnnouncementTitle("");
                setAnnouncementContent("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Announcements List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Announcements</h3>
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((ann) => (
              <li key={ann.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{ann.title}</h4>
                <p className="text-sm">{ann.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted: {new Date(ann.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(ann)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
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