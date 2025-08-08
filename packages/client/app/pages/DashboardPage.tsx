// packages/client/app/pages/DashboardPage.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Overview from 'app/components/DashboardComponents/Overview';
import Announcements from 'app/components/DashboardComponents/Announcements';
import Schedule from 'app/components/DashboardComponents/Schedule';
import Homework from 'app/components/DashboardComponents/Homework';
import Resources from 'app/components/DashboardComponents/Resources';
import Quizzes from 'app/components/DashboardComponents/Quizzes';

export default function DashboardPage() {
  const { auth, isAuthLoading, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!isAuthLoading && !auth.isLoggedIn) {
      router.push('/auth/login');
    }
  }, [auth.isLoggedIn, isAuthLoading, router]);

  if (isAuthLoading) {
    return null;
  }
  if (!auth.isLoggedIn) {
    return null;
  }

  // Navigation buttons at the top
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f7f7] text-black">
      <div className="flex justify-between items-center p-4 bg-[#e5e5e5] border-b border-gray-300">
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
          >
            Main Page
          </button>
          {auth.user?.isSuperuser && (
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
            >
              Admin Page
            </button>
          )}
        </div>
      </div>
      <div className="flex min-h-screen bg-[#f7f7f7] text-black">
        {/* Mobile Nav Toggle (shows on small screens only) */}
        <div className="fixed top-0 left-0 w-full z-30 md:hidden flex justify-between items-center p-4 bg-[#e5e5e5] border-b border-gray-300">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile Drawer Menu */}
        {mobileNavOpen && (
          <div className="fixed top-[56px] left-0 w-full bg-[#e5e5e5] z-40 p-4 border-b border-gray-300 md:hidden animate-fade-in">
            <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'quizzes'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('quizzes')}
              >
                Quizzes
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'resources'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('resources')}
              >
                Resources
              </button>
            </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded ${
                    activeSection === 'overview'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setActiveSection('overview');
                    setMobileNavOpen(false);
                  }}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded ${
                    activeSection === 'schedule'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setActiveSection('schedule');
                    setMobileNavOpen(false);
                  }}
                >
                  Schedule
                </button>
              </li>
              <li>
                <Link
                  href="/"
                  className="block p-2 rounded hover:bg-gray-200"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Back to Home
                </Link>
              </li>
              <li>
                <hr className="my-2" />
              </li>
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
        )}
        {/* Left Sidebar (hidden on mobile) */}
        <div className="hidden md:flex flex-col w-[250px] bg-[#e5e5e5] p-4 border-r border-gray-300 min-h-screen">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'overview'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('overview')}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'announcements'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('announcements')}
              >
                Announcements
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'homework'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('homework')}
              >
                Homework
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'resources'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('resources')}
              >
                Resources
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'quizzes'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('quizzes')}
              >
                Quizzes
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'schedule'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveSection('schedule')}
              >
                Schedule
              </button>
            </li>
            <li>
              <Link href="/" className="block p-2 rounded hover:bg-gray-200">
                Back to Home
              </Link>
            </li>
          </ul>
        </div>
        {/* Main Content (adapts to available space) */}
        <div className="flex-1 p-4 sm:p-8 min-w-0">
          {activeSection === 'overview' && <Overview email={auth.user?.email} />}
          {activeSection === 'announcements' && <Announcements />}
          {activeSection === 'homework' && <Homework />}
          {activeSection === 'resources' && <Resources />}
          {activeSection === 'quizzes' && <Quizzes />}
          {activeSection === 'schedule' && <Schedule />}
        </div>
        {/* Right Sidebar (hidden on mobile) */}
        <div className="hidden md:flex flex-col w-[250px] bg-[#e5e5e5] p-4 border-l border-gray-300 min-h-screen">
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
    </div>
  );
}
