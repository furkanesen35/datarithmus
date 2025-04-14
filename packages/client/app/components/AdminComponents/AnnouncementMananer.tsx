"use client";
import { useState, useEffect } from "react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function AnnouncementsManager() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setAnnouncements(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const body = {
      title,
      content,
      pinned,
      ...(editingId && { id: editingId }),
    };

    const res = await fetch("/api/announcements", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      fetchAnnouncements();
      setTitle("");
      setContent("");
      setPinned(false);
      setEditingId(null);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setPinned(announcement.pinned);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/announcements", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) fetchAnnouncements();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Announcement" : "Create Announcement"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="pinned" className="flex items-center">
            <input
              id="pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="mr-2"
            />
            Pin Announcement
          </label>
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingId ? "Update Announcement" : "Create Announcement"}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Announcements</h3>
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 bg-white border border-gray-300 rounded-md mb-2">
            <h4 className="text-md font-medium">
              {announcement.title} {announcement.pinned && <span className="text-blue-500">[Pinned]</span>}
            </h4>
            <p className="text-sm">{announcement.content}</p>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => handleEdit(announcement)} className="text-blue-500 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(announcement.id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}