// packages/client/app/components/HomeComponents/SecondContainer.tsx
import Link from 'next/link';
import React from 'react';

const announcements = [
  {
    course: 'Data Fundamentals',
    startDate: 'September 01, 2025',
    description:
      'Learn Python, SQL, Power BI, Excel, IT Literacy, Web Scraping, Git & Github, Career Insights. 10 weeks - 100 hours.',
    curriculumLink: '/courses/data-fundamentals',
  },
  {
    course: 'BI Data Analyst',
    startDate: 'September 01, 2025',
    description:
      'Excel for Data Analysis, SQL for BI, Power BI & Data Visualization, Statistics, Business Analysis, Data Modeling, ETL, Capstone Project, Soft Skills. 24 weeks - 192 hours.',
    curriculumLink: '/courses/bi-data-analyst',
  },
  {
    course: 'Analytics Engineer',
    startDate: 'September 01, 2025',
    description:
      'Python for Data Engineering, SQL for Analytics, Data Warehousing, Cloud Data Platforms, Data Modeling, BI Tools, Capstone Project, Version Control, DataOps, Soft Skills. 24 weeks - 192 hours.',
    curriculumLink: '/courses/analytics-engineer',
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
            <h3 className="text-xl font-semibold mb-2 text-[#E2E8F0]">
              {a.course}
            </h3>
            <p className="text-base mb-1 text-[#E2E8F0]">
              Start Date:{' '}
              <span className="font-bold text-[#38B2AC]">{a.startDate}</span>
            </p>
            <p className="mb-4 text-center text-[#E2E8F0]/80">
              {a.description}
            </p>
            <div className="flex gap-4 w-full justify-center mt-auto">
              <Link
                href={a.curriculumLink}
                className="px-4 py-2 bg-[#FBBF24] text-[#2D3748] rounded-md hover:bg-yellow-400 transition-all duration-300 font-semibold"
              >
                <span className="text-xs">Curriculum</span>
              </Link>
              <Link
                href="/enroll"
                className="px-4 py-2 bg-blue-500 text-[#E2E8F0] rounded-md hover:bg-blue-600 transition-all duration-300 font-semibold"
              >
                <span className="text-xs">Enroll Now</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecondContainer;
