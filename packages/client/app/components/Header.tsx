"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState<boolean>(false);
  const { auth, logout } = useAuth();

  const coursesLinks = (
    <>
      <Link href="/courses/data-science" className="block py-2 px-4 hover:bg-gray-700">Data Science</Link>
      <Link href="/courses/machine-learning" className="block py-2 px-4 hover:bg-gray-700">Machine Learning</Link>
      <Link href="/courses/data-analysis" className="block py-2 px-4 hover:bg-gray-700">Data Analysis</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden lg:flex justify-center items-center bg-[#4a0083] h-[40px] text-white text-xs sm:text-sm">
        Think you've got what it takes for a career in Data? Find out in just one minute!
        <button className="text-black bg-yellow-400 px-2 py-1 ml-2 rounded">Take the test now!</button>
      </div>

      <nav className="flex justify-between items-center bg-black text-white h-[50px] px-4">
        <div>Datarithmus</div>

        <div className="hidden lg:flex justify-around w-[500px]">
          <div className="relative">
            <a
              href="#courses"
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
              }}
            >
              Our Courses
            </a>
            <div className={`absolute top-full left-0 bg-black w-[200px] transition-opacity duration-300 ${isCoursesDropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {coursesLinks}
            </div>
          </div>
          <Link href="/career" className="hover:text-gray-300">Career</Link>
          <Link href="/events" className="hover:text-gray-300">Events</Link>
          <Link href="/about" className="hover:text-gray-300">About Us</Link>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
        </div>

        <div className="lg:hidden flex">
          <button className="mr-4 hover:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`lg:hidden absolute top-[50px] left-0 w-full bg-black transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
            <div className={`${isCoursesDropdownOpen && isMenuOpen ? 'block' : 'hidden'}`}>
              {coursesLinks}
            </div>
          </div>
          <Link href="/career" className="block py-2 px-4 hover:bg-gray-700">Career</Link>
          <Link href="/events" className="block py-2 px-4 hover:bg-gray-700">Events</Link>
          <Link href="/about" className="block py-2 px-4 hover:bg-gray-700">About Us</Link>
          <Link href="/blog" className="block py-2 px-4 hover:bg-gray-700">Blog</Link>
        </div>

        <div className="hidden lg:block">
          {auth.isLoggedIn ? (
            <button
              onClick={logout}
              className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login / Register
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}