// packages/client/app/components/HomeComponents/SecondContainer.tsx
import Link from 'next/link';
import React from 'react';

const announcements = [
  {
    course: 'Data Science Bootcamp',
    startDate: 'September 01, 2025',
    description:
      'Kickstart your career in Data Science with our intensive bootcamp.',
  },
  {
    course: 'Machine Learning Essentials',
    startDate: 'September 1, 2025',
    description: 'Learn the fundamentals of ML with hands-on projects.',
  },
  {
    course: 'Python for Data Analysis',
    startDate: 'September 01, 2025',
    description: 'Master Python and data analysis techniques.',
  },
];

const SecondContainer = () => {
  return (
    <section className="w-full py-8 bg-[#1A202C] flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#E2E8F0] mb-6 text-center">
        Upcoming Course Starts
      </h2>
      <div className="grid gap-8 md:grid-cols-3 w-full max-w-5xl px-4">
        {announcements.map((a, idx) => (
          <div
            key={idx}
            className="bg-[#2D3748] rounded-xl shadow-lg p-8 flex flex-col items-center text-[#E2E8F0] border-2 border-[#4A5568]"
          >
            <h3 className="text-xl font-semibold mb-2 text-[#E2E8F0]">{a.course}</h3>
            <p className="text-base mb-1 text-[#E2E8F0]">
              Start Date: <span className="font-bold text-[#38B2AC]">{a.startDate}</span>
            </p>
            <p className="mb-4 text-center text-[#E2E8F0]/80">{a.description}</p>
            <Link href="/enroll" className="mt-auto px-4 py-2 bg-blue-500 text-[#E2E8F0] rounded-md hover:bg-blue-600 transition-all duration-300 font-semibold">
              Enroll Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecondContainer;
