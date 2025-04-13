"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import VideoManager from "../components/AdminComponents/VideoManager";
import HomeworkManager from "../components/AdminComponents/HomeworkManager";
import ScheduleManager from "../components/AdminComponents/ScheduleManager";
import QuizManager from "../components/AdminComponents/QuizManager";
import AnnouncementsManager from "app/components/AdminComponents/AnnouncementMananer";
import ResourceManager from "app/components/AdminComponents/ResourceManagement";

export default function AdminPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn || !auth.user?.isSuperuser) {
      router.push("/auth?tab=login");
    }
  }, [auth.isLoggedIn, auth.user?.isSuperuser, router]);

  if (!auth.isLoggedIn || !auth.user?.isSuperuser) {
    return null;
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth?tab=login");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
        <p className="mb-8 text-center">Welcome, {auth.user.email}! Manage bootcamp content below.</p>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>
        )}

        {/* Accordion Sections */}
        <div className="space-y-4">
          {/* Videos Section */}
          <button
            onClick={() => toggleSection("videos")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Videos</span>
            <span className="text-xl">
              {activeSection === "videos" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "videos" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <VideoManager onMessage={setMessage} onError={setError} />
            </div>
          )}

          {/* Announcements Section */}
          <button
            onClick={() => toggleSection("announcements")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Announcements</span>
            <span className="text-xl">
              {activeSection === "announcements" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "announcements" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <AnnouncementsManager onMessage={setMessage} onError={setError} />
            </div>
          )}

          {/* Homework Section */}
          <button
            onClick={() => toggleSection("homework")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Homework</span>
            <span className="text-xl">
              {activeSection === "homework" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "homework" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <HomeworkManager onMessage={setMessage} onError={setError} />
            </div>
          )}

          {/* Resources Section */}
          <button
            onClick={() => toggleSection("resources")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Resources</span>
            <span className="text-xl">
              {activeSection === "resources" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "resources" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <ResourceManager onMessage={setMessage} onError={setError} />
            </div>
          )}

          {/* Schedule Section */}
          <button
            onClick={() => toggleSection("schedule")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Schedule</span>
            <span className="text-xl">
              {activeSection === "schedule" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "schedule" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <ScheduleManager onMessage={setMessage} onError={setError} />
            </div>
          )}

          {/* Quizzes Section */}
          <button
            onClick={() => toggleSection("quizzes")}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg font-semibold">Manage Quizzes</span>
            <span className="text-xl">
              {activeSection === "quizzes" ? "−" : "+"}
            </span>
          </button>
          {activeSection === "quizzes" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <QuizManager onMessage={setMessage} onError={setError} />
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}