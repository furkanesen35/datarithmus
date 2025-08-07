// packages/client/app/components/Header.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import CoursesTab from './HeaderComponents/CoursesTab';
import ExpertCoursesTab from './HeaderComponents/ExpertCoursesTab';
import CertificationsTab from './HeaderComponents/CertificationsTab';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'career' | 'expert' | 'cert'>(
    'career',
  );
  const { auth, logout } = useAuth();

  const coursesLinks = (
    <>
      <Link
        href="/courses/data-science"
        className="block py-2 px-4 hover:bg-gray-700"
      >
        Data Science
      </Link>
      <Link
        href="/courses/machine-learning"
        className="block py-2 px-4 hover:bg-gray-700"
      >
        Machine Learning
      </Link>
      <Link
        href="/courses/data-analysis"
        className="block py-2 px-4 hover:bg-gray-700"
      >
        Data Analysis
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* <div className="hidden lg:flex justify-center items-center bg-[#4a0083] h-[40px] text-white text-xs sm:text-sm">
        Think you&apos;ve got what it takes for a career in Data? Find out in
        just one minute!
        <button className="text-black bg-yellow-400 px-2 py-1 ml-2 rounded">
          Take the test now!
        </button>
      </div> */}

      <nav className="flex items-center bg-black text-white h-[50px] px-4">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">Datarithmus</div>

        {/* Middle: Navigation */}
        <div className="flex-1 hidden lg:flex justify-center items-center">
          <div
            className="relative"
            onMouseEnter={() => setIsCoursesDropdownOpen(true)}
            onMouseLeave={() => setIsCoursesDropdownOpen(false)}
          >
            <a
              href="#career-paths"
              className="cursor-pointer px-4 py-2 hover:bg-gray-800 rounded transition text-white"
              onClick={(e) => {
                e.preventDefault();
                setIsCoursesDropdownOpen((open) => !open);
              }}
            >
              Career Paths
            </a>
            <div
              className={`fixed left-0 top-[90px] w-full h-[350px] bg-white shadow-2xl rounded-none flex transition-all duration-300 z-50 ${isCoursesDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              style={{ borderRadius: 0 }}
            >
              {/* Tabs on the left */}
              <div className="w-[180px] h-full border-r flex flex-col py-6 px-4 gap-4 bg-gray-100">
                <button
                  className={`text-lg font-semibold rounded px-2 py-2 text-left transition ${activeTab === 'career' ? 'bg-blue-100 text-blue-700' : 'text-blue-700 hover:bg-blue-100'}`}
                  onClick={() => setActiveTab('career')}
                  onMouseEnter={() => setActiveTab('career')}
                >
                  Courses
                </button>
                <button
                  className={`text-lg font-semibold rounded px-2 py-2 text-left transition ${activeTab === 'expert' ? 'bg-blue-100 text-blue-700' : 'text-blue-700 hover:bg-blue-100'}`}
                  onClick={() => setActiveTab('expert')}
                  onMouseEnter={() => setActiveTab('expert')}
                >
                  Expert Courses
                </button>
                <button
                  className={`text-lg font-semibold rounded px-2 py-2 text-left transition ${activeTab === 'cert' ? 'bg-blue-100 text-blue-700' : 'text-blue-700 hover:bg-blue-100'}`}
                  onClick={() => setActiveTab('cert')}
                  onMouseEnter={() => setActiveTab('cert')}
                >
                  Certifications
                </button>
              </div>
              {/* Placeholder for tab content */}
              <div className="flex-1 h-full overflow-y-auto">
                {activeTab === 'career' && <CoursesTab />}
                {activeTab === 'expert' && <ExpertCoursesTab />}
                {activeTab === 'cert' && <CertificationsTab />}
              </div>
            </div>
          </div>
          <Link href="/career" className="hover:text-gray-300 ml-6">
            Career
          </Link>
          <Link href="/events" className="hover:text-gray-300 ml-6">
            Events
          </Link>
          <Link href="/about" className="hover:text-gray-300 ml-6">
            About Us
          </Link>
          <Link href="/blog" className="hover:text-gray-300 ml-6">
            Blog
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="lg:hidden flex items-center">
          <button
            className="mr-4 hover:text-gray-300"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex-1 flex items-center justify-end gap-2 lg:flex">
          {/* Only show auth buttons in header on lg and up */}
          <div className="hidden lg:flex items-center gap-2">
            {auth.isLoggedIn && (
              <Link
                href="/dashboard"
                className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Dashboard
              </Link>
            )}
            {auth.isLoggedIn && auth.user?.isSuperuser && (
              <Link
                href="/admin"
                className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Admin Page
              </Link>
            )}
            {auth.isLoggedIn ? (
              <button
                onClick={logout}
                className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-[50px] left-0 w-full bg-black transition-opacity duration-500 z-50">
            <div>
              <a
                href="#courses"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
                }}
              >
                Our Courses
              </a>
              <div
                className={`${isCoursesDropdownOpen && isMenuOpen ? 'block' : 'hidden'}`}
              >
                {coursesLinks}
              </div>
            </div>
            <Link href="/career" className="block py-2 px-4 hover:bg-gray-700">
              Career
            </Link>
            <Link href="/events" className="block py-2 px-4 hover:bg-gray-700">
              Events
            </Link>
            <Link href="/about" className="block py-2 px-4 hover:bg-gray-700">
              About Us
            </Link>
            <Link href="/blog" className="block py-2 px-4 hover:bg-gray-700">
              Blog
            </Link>
            {/* Only show auth buttons in mobile menu if not xl */}
            {!auth.isLoggedIn && (
              <Link
                href="/auth/login"
                className="block py-2 px-4 bg-blue-700 hover:bg-red-700 "
              >
                Login/Register
              </Link>
            )}
            {auth.isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500 w-full"
                >
                  Dashboard
                </Link>
                {auth.user?.isSuperuser && (
                  <Link
                    href="/admin"
                    className="block py-2 px-6 bg-green-600 text-white rounded hover:bg-green-500 w-full"
                  >
                    Admin Page
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block py-2 px-6 bg-red-600 text-white rounded hover:bg-red-500 w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
