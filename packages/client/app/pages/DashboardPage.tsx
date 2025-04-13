"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Overview from "app/components/DashboardComponents/Overview";
import MyCourses from "app/components/DashboardComponents/MyCourses";
import MyProgress from "app/components/DashboardComponents/MyProgress";
import Recordings from "app/components/DashboardComponents/Recordings";
import Schedule from "app/components/DashboardComponents/Schedule";
import ImportantLinks from "app/components/DashboardComponents/ImportantLinks";

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  // Redirect if not logged in (client-side)
  useEffect(() => {
    if (!auth.isLoggedIn) {
      router.push("/auth?tab=login");
    }
  }, [auth.isLoggedIn, router]);

  // Prevent rendering until auth is checked
  if (!auth.isLoggedIn) {
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
                activeSection === "overview" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
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
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "recordings" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("recordings")}
            >
              Recordings
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "schedule" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("schedule")}
            >
              Schedule
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${
                activeSection === "links" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("links")}
            >
              Important Links
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
        {activeSection === "overview" && <Overview email={auth.user?.email} />}
        {activeSection === "courses" && <MyCourses />}
        {activeSection === "progress" && <MyProgress />}
        {activeSection === "recordings" && <Recordings />}
        {activeSection === "schedule" && <Schedule />}
        {activeSection === "links" && <ImportantLinks />}
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