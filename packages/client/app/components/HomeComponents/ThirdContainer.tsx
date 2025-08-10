// packages/client/app/components/HomeComponents/ThirdContainer.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function ThirdContainer() {
  const cardsData = [
    {
      title: 'Data Science Bootcamp',
      description: 'Learn Data Science from scratch.',
      link: '/courses/data-science-bootcamp',
      image: '/images/Data_Science.jpg',
    },
    {
      title: 'Machine Learning Course',
      description: 'Master ML algorithms and techniques.',
      link: '/courses/machine-learning-course',
      image: '/images/Machine_Learning.jpg',
    },
    {
      title: 'Python for Data Analysis',
      description: 'Dive into data manipulation with Python.',
      link: '/courses/python-for-data-analysis',
      image: '/images/Python-for-data-analysis.jpg',
    },
    {
      title: 'Big Data Analytics',
      description: 'Explore big data technologies and applications.',
      link: '/courses/big-data-analytics',
      image: '/images/Big-Data-analytics.jpg',
    },
  ];

  return (
  <div className="container mx-auto my-8 bg-[#1A202C]">
      <h1 className="text-[#F7FAFC] p-[5px] font-bold text-2xl">Career Paths</h1>
      <p className="text-[#CBD5E1] p-[5px]">
        The business courses train beginners in the data business.
      </p>
      <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 scrollbar-thin scrollbar-thumb-[#4A5568] scrollbar-track-[#1A202C]">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="min-w-[260px] md:min-w-0 bg-[#2D3748] border border-[#4A5568] rounded-lg shadow-md overflow-hidden"
          >
            <Link href={card.link}>
              <Image
                className="w-full h-48 object-cover"
                src={card?.image}
                alt={card.title}
                width={400}
                height={192}
                style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
                priority={index === 0}
              />
            </Link>
            <div className="p-4">
              <h3 className="text-[#FBBF24] text-xl font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-[#F7FAFC] text-base mb-4">{card.description}</p>
              <Link href={card.link} className="inline-block px-4 py-2 bg-[#38B2AC] text-black rounded hover:bg-[#FBBF24] transition duration-300 font-semibold">Learn More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThirdContainer;
