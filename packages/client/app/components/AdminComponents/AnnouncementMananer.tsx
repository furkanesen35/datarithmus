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
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchAnnouncements(token);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Login failed");
      }
      const { token } = await res.json();
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setError(null);
      fetchAnnouncements(token);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const fetchAnnouncements = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      setAnnouncements(await res.json());
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch announcements");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in");
        return;
      }
      const body = {
        title,
        content,
        pinned,
        ...(editingId && { id: editingId }),
      };
      const res = await fetch("http://localhost:5000/api/announcements", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      fetchAnnouncements(token);
      setTitle("");
      setContent("");
      setPinned(false);
      setEditingId(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setPinned(announcement.pinned);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in");
        return;
      }
      const res = await fetch("http://localhost:5000/api/announcements", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      fetchAnnouncements(token);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete announcement");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
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
          ))
        )}
      </div>
    </div>
  );
}