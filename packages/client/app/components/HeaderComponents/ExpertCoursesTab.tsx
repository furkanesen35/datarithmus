import React from 'react';
import Image from 'next/image';

const expertCourses = [
  {
    title: 'Machine Learning Engineer',
    image: '/images/Machine_Learning.jpg',
    description: 'Design and deploy ML models and pipelines.',
  },
  {
    title: 'LLM Engineer',
    image: '/images/Data_Science.jpg',
    description: 'Build and fine-tune large language models.',
  },
  {
    title: 'Dataops',
    image: '/images/Big-Data-analytics.jpg',
    description: 'Automate and optimize data workflows.',
  },
];

const ExpertCoursesTab = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 text-black">Expert Courses</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {expertCourses.map((course) => (
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
          <p className="text-sm text-black text-center">{course.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ExpertCoursesTab;
