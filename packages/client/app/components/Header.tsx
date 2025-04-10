"use client";

import Link from 'next/link';
import '../globals.css';
import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="hidden lg:flex lg:flex-row lg:justify-center lg:items-center bg-[#4a0083] h-[40px]">
        <div className="text-white text-xs sm:text-sm">
          Think you've got what it takes for a career in Data? Find out in just one minute!
          <button className="text-black bg-yellow-400 px-2 py-1 ml-2 rounded cursor-pointer">Take the test now!</button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-row justify-between text-white bg-black items-center h-[50px] px-4">
        <div>Datarithmus</div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row justify-around w-[500px]">
          {/* Courses Dropdown */}
          <div className="relative">
            <a href="#courses" className="cursor-pointer" onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}>Our Courses</a>
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 bg-black text-white w-[200px] transition-all duration-300 ${isCoursesDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <a href="#data-science" className="block py-2 px-4 hover:bg-gray-700">Data Science</a>
              <a href="#machine-learning" className="block py-2 px-4 hover:bg-gray-700">Machine Learning</a>
              <a href="#data-analysis" className="block py-2 px-4 hover:bg-gray-700">Data Analysis</a>
            </div>
          </div>

          <a href="#career">Career</a>
          <a href="#events">Events</a>
          <a href="#about">About Us</a>
          <a href="#blog">Blog</a>
        </div>

        {/* Appointment and Mobile Menu Toggle */}
        <div className="flex lg:hidden">
          <button className="mr-4 text-white hover:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
          <button className="hidden bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 cursor-pointer">Book an Appointment</button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden absolute top-[50px] w-full bg-black left-0 text-white transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)' }}>
          {/* Mobile Courses Dropdown */}
          <div>
            <a href="#courses" className="block py-2 px-4 hover:bg-gray-700" onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}>Our Courses</a>
            <div className={`${isCoursesDropdownOpen && isMenuOpen ? 'block' : 'hidden'}`}>
              <a href="#data-science" className="block py-2 px-8 hover:bg-gray-700">Data Science</a>
              <a href="#machine-learning" className="block py-2 px-8 hover:bg-gray-700">Machine Learning</a>
              <a href="#data-analysis" className="block py-2 px-8 hover:bg-gray-700">Data Analyst</a>
            </div>
          </div>

          <a href="#career" className="block py-2 px-4 hover:bg-gray-700">Career</a>
          <a href="#events" className="block py-2 px-4 hover:bg-gray-700">Events</a>
          <a href="#about" className="block py-2 px-4 hover:bg-gray-700">About Us</a>
          <a href="#blog" className="block py-2 px-4 hover:bg-gray-700">Blog</a>
        </div>

        {/* Appointment Button for Desktop */}
        <div className="hidden lg:block">
          <Link href="/auth" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login / Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;