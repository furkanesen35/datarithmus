"use client";
import { useState } from "react";

interface Video {
  id: number;
  title: string;
  fileName: string;
  uploadedAt: string;
}

interface VideoManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function VideoManager({ onMessage, onError }: VideoManagerProps) {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoFile) {
      onError("Title and file are required");
      return;
    }

    // Simulate video upload
    const newVideo: Video = {
      id: Date.now(),
      title: videoTitle,
      fileName: videoFile.name,
      uploadedAt: new Date().toISOString(),
    };
    setVideos([newVideo, ...videos]);
    onMessage("Video uploaded successfully");

    setVideoTitle("");
    setVideoFile(null);
  };

  const handleDelete = (id: number) => {
    setVideos(videos.filter((vid) => vid.id !== id));
    onMessage("Video deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload Session Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="videoTitle" className="block text-sm font-medium">
            Video Title
          </label>
          <input
            type="text"
            id="videoTitle"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium">
            Video File
          </label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Upload Video
        </button>
      </form>

      {/* Videos List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded Videos</h3>
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {videos.map((vid) => (
              <li key={vid.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{vid.title}</h4>
                <p className="text-sm">File: {vid.fileName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: {new Date(vid.uploadedAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => handleDelete(vid.id)}
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