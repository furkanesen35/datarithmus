"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import VideoManager from "../components/AdminComponents/VideoManager";
import AnnouncementsManager from "app/components/AdminComponents/AnnouncementMananer";

export default function AdminPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
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

      {/* Video Manager */}
      <VideoManager onMessage={setMessage} onError={setError} />

      {/* Announcements Manager */}
      <AnnouncementsManager onMessage={setMessage} onError={setError} />

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