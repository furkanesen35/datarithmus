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
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 text-black">Courses</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {courses.map((course) => {
        let link = '';
        if (course.title === 'Data Fundamentals') link = '/courses/data-fundamentals';
        if (course.title === 'BI Data Analyst') link = '/courses/bi-data-analyst';
        if (course.title === 'Analytics Engineer') link = '/courses/analytics-engineer';
        return (
          <Link href={link} key={course.title} className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center w-[260px] h-[220px] cursor-pointer hover:shadow-lg transition">
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
            <p className="text-sm text-black text-center">{course.description}</p>
          </Link>
        );
      })}
    </div>
  </div>
);

export default CoursesTab;
