"use client";
import { useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  description: string;
  filePath: string;
  createdAt: string;
}

export default function VideoManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await fetch("/api/videos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setVideos(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || (!editingId && !file)) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);
    if (editingId) formData.append("id", editingId.toString());

    const res = await fetch("/api/videos", {
      method: editingId ? "PUT" : "POST",
      body: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) {
      fetchVideos();
      setTitle("");
      setDescription("");
      setFile(null);
      setEditingId(null);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setDescription(video.description);
    setFile(null);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/videos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) fetchVideos();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Video" : "Upload Video"}</h2>
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
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium">Video File</label>
          <input
            id="file"
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingId ? "Update Video" : "Upload Video"}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Videos</h3>
        {videos.map((video) => (
          <div key={video.id} className="p-4 bg-white border border-gray-300 rounded-md mb-2">
            <h4 className="text-md font-medium">{video.title}</h4>
            <p className="text-sm">{video.description}</p>
            <video src={video.filePath} controls className="mt-2 w-full max-w-xs" />
            <div className="mt-2 flex space-x-2">
              <button onClick={() => handleEdit(video)} className="text-blue-500 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(video.id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}