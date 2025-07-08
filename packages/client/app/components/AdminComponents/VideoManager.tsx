// packages/client/app/components/AdminComponents/VideoManager.tsx
'use client';
import { useState, useEffect } from 'react';

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string; // changed from filePath
  createdAt: string;
}

export default function VideoManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await fetch('/api/videos', {
      credentials: 'include', // Send cookies for authentication
    });
    if (res.ok) {
      setVideos(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !videoUrl) return;
    const body = JSON.stringify({
      id: editingId,
      title,
      description,
      videoUrl,
    });
    const res = await fetch('/api/videos', {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies for authentication
      body,
    });
    if (res.ok) {
      fetchVideos();
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setEditingId(null);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setDescription(video.description);
    setVideoUrl(video.videoUrl);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch('/api/videos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies for authentication
    });
    if (res.ok) fetchVideos();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? 'Edit Video' : 'Add Video'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium">
            YouTube Link
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingId ? 'Update Video' : 'Add Video'}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Videos</h3>
        {videos.map((video) => (
          <div
            key={video.id}
            className="p-4 bg-white border border-gray-300 rounded-md mb-2"
          >
            <h4 className="text-md font-medium">{video.title}</h4>
            <p className="text-sm">{video.description}</p>
            {video.videoUrl && (
              <div className="mt-2">
                <iframe
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full max-w-xs"
                />
              </div>
            )}
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(video)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getYouTubeId(url: string): string | undefined {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : undefined;
}
