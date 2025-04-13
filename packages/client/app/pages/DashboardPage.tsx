"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("announcements");

  // Redirect if not logged in
  if (!auth.isLoggedIn) {
    router.push("/auth?tab=login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth?tab=login");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f7] text-black">
      {/* Left Sidebar - Navigation */}
      <div className="w-[250px] bg-[#e5e5e5] p-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "announcements" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("announcements")}
            >
              Announcements
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "courses" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("courses")}
            >
              My Courses
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "progress" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("progress")}
            >
              Progress
            </button>
          </li>
          <li>
            <Link href="/" className="block p-2 rounded hover:bg-gray-200">
              Back to Home
            </Link>
          </li>
        </ul>
      </div>

      {/* Middle - Content */}
      <div className="flex-1 p-8">
        {activeSection === "announcements" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {auth.user?.email}!</h1>
            <p>This is your dashboard announcements tab. Check your updates and news from this place.</p>
          </div>
        )}
        {activeSection === "courses" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">My Courses</h1>
            <p>Enrolled courses will appear here (e.g., Data Science Bootcamp).</p>
          </div>
        )}
        {activeSection === "progress" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Progress</h1>
            <p>Your learning progress will be tracked here.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Account Settings */}
      <div className="w-[250px] bg-[#e5e5e5] p-4 border-l border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left p-2 rounded hover:bg-gray-200">
              Edit Profile
            </button>
          </li>
          <li>
            <button className="w-full text-left p-2 rounded hover:bg-gray-200">
              Change Password
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}