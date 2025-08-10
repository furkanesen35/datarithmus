import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const courses = [
  {
    title: 'Data Fundamentals',
    image: '/images/Python-for-data-analysis.jpg',
    description: 'Learn the basics of data, analysis, and Python.',
  },
  {
    title: 'BI Data Analyst',
    image: '/images/Data_Science.jpg',
    description: 'Master business intelligence and data analysis skills.',
  },
  {
    title: 'Analytics Engineer',
    image: '/images/Big-Data-analytics.jpg',
    description: 'Build scalable analytics solutions and pipelines.',
  },
];

const CoursesTab = () => (
  <div className="p-8 bg-white">
    <h2 className="text-2xl font-bold mb-4 text-black">Courses</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {courses.map((course) => {
        let curriculumLink = '';
        if (course.title === 'Data Fundamentals')
          curriculumLink = '/courses/data-fundamentals';
        if (course.title === 'BI Data Analyst')
          curriculumLink = '/courses/bi-data-analyst';
        if (course.title === 'Analytics Engineer')
          curriculumLink = '/courses/analytics-engineer';
        return (
          <div
            key={course.title}
            className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center w-[260px] h-[220px] cursor-pointer hover:shadow-lg transition"
          >
            <Image
              src={course.image}
              alt={course.title}
              width={140}
              height={90}
              className="rounded mb-3 object-cover"
              style={{ width: '140px', height: '90px' }}
            />
            <h3 className="text-lg font-semibold mb-1 text-black">
              {course.title}
            </h3>
            <div className="flex gap-2 mt-4">
              <Link
                href={curriculumLink}
                className="px-3 py-1 bg-red-300 text-black rounded hover:bg-red-400 transition font-semibold"
              >
                Curriculum
              </Link>
              <Link
                href="/enroll"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default CoursesTab;
