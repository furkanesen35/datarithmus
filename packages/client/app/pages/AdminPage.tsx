"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn || !auth.user?.isSuperuser) {
      router.push("/auth?tab=login");
    }
  }, [auth.isLoggedIn, auth.user?.isSuperuser, router]);

  if (!auth.isLoggedIn || !auth.user?.isSuperuser) {
    return null;
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoFile) {
      setError("Title and file are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/admin/upload/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: videoTitle, filePath: videoFile.name }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Video uploaded successfully");
        setVideoTitle("");
        setVideoFile(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Upload failed");
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      setError("Title and content are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/admin/upload/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, content: postContent }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Post created successfully");
        setPostTitle("");
        setPostContent("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Upload failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth?tab=login");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p className="mb-6">Welcome, {auth.user.email}! Manage content below.</p>

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      {/* Video Upload */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <div>
            <label htmlFor="videoTitle" className="block text-sm font-medium">
              Video Title
            </label>
            <input
              type="text"
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
      </div>

      {/* Post Creation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label htmlFor="postTitle" className="block text-sm font-medium">
              Post Title
            </label>
            <input
              type="text"
              id="postTitle"
              value={postTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="postContent" className="block text-sm font-medium">
              Content
            </label>
            <textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}