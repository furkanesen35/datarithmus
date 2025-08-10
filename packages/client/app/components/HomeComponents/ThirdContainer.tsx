// packages/client/app/components/HomeComponents/ThirdContainer.tsx
import React from 'react';
import Image from 'next/image';

function ThirdContainer() {
  const pillars = [
    {
      title: 'Courses',
      items: [
        {
          name: 'Data Fundamentals',
          image: '/images/Python-for-data-analysis.jpg',
          info: [
            'Python',
            'SQL',
            'Power BI',
            'Excel',
            'IT Literacy',
            'Web Scraping',
            'Git & Github',
            'Career Insights',
            '10 weeks - 100 hours',
          ],
        },
        {
          name: 'BI Data Analyst',
          image: '/images/Data_Science.jpg',
          info: [
            'Excel for Data Analysis',
            'SQL for BI',
            'Power BI & Data Visualization',
            'Statistics & Data Interpretation',
            'Business Analysis & Reporting',
            'Data Modeling & DAX',
            'ETL & Data Preparation',
            'BI Capstone Project',
            'Soft Skills & Communication',
            '24 weeks - 192 hours',
          ],
        },
        {
          name: 'Analytics Engineer',
          image: '/images/Big-Data-analytics.jpg',
          info: [
            'Python for Data Engineering',
            'SQL for Analytics',
            'Data Warehousing & ETL',
            'Cloud Data Platforms (Azure, AWS, GCP)',
            'Data Modeling & Governance',
            'Business Intelligence Tools',
            'Analytics Engineering Capstone Project',
            'Version Control & CI/CD',
            'DataOps & Orchestration',
            'Soft Skills & Communication',
            '24 weeks - 192 hours',
          ],
        },
      ],
    },
    {
      title: 'Expert Courses',
      items: [
        {
          name: 'Machine Learning Engineer',
          image: '/images/Machine_Learning.jpg',
          info: [
            'Python for ML',
            'Data Preprocessing & Feature Engineering',
            'Supervised & Unsupervised Learning',
            'Deep Learning & Neural Networks',
            'Model Deployment & MLOps',
            'ML Capstone Project',
            'Soft Skills & Communication',
            '24 weeks - 192 hours',
            '',
          ],
        },
        {
          name: 'LLM Engineer',
          image: '/images/Python-for-data-analysis.jpg',
          info: [
            'Python for NLP',
            'Text Preprocessing & Tokenization',
            'Transformer Architectures',
            'Fine-tuning LLMs',
            'Prompt Engineering',
            'Generative AI Applications',
            'LLM Capstone Project',
            'Soft Skills & Communication',
            '20 weeks - 160 hours',
            '',
          ],
        },
        {
          name: 'DataOps',
          image: '/images/Big-Data-analytics.jpg',
          info: [
            'DataOps Fundamentals',
            'Orchestration Tools (Airflow, Prefect)',
            'Monitoring & Logging',
            'CI/CD for Data Pipelines',
            'Cloud DataOps (Azure, AWS, GCP)',
            'Automation & Scripting',
            'DataOps Capstone Project',
            'Soft Skills & Communication',
            '16 weeks - 128 hours',
          ],
        },
      ],
    },
    {
      title: 'Certification',
      items: [
        {
          name: 'Power BI PL-300',
          image: '/images/Data_Science.jpg',
          info: [
            'Power BI Fundamentals',
            'Data Preparation & Modeling',
            'Data Visualization & Reporting',
            'DAX & Advanced Analytics',
            'Power BI Service & Deployment',
            'PL-300 Exam Preparation',
            '12 weeks - 96 hours',
            '',
            '',
          ],
        },
        {
          name: 'Fabric Engineer',
          image: '/images/Machine_Learning.jpg',
          info: [
            'Microsoft Fabric Fundamentals',
            'Data Integration & ETL',
            'Fabric Data Engineering',
            'Fabric Data Modeling',
            'Fabric Security & Governance',
            'Fabric Analytics & Reporting',
            'Fabric Capstone Project',
            'Soft Skills & Communication',
            '20 weeks - 160 hours',
          ],
        },
      ],
    },
  ];

  return (
  <div className="w-full py-8 bg-[#301934] px-4">
    <h1 className="text-[#F7FAFC] p-[5px] font-bold text-2xl text-center mb-4">
      Our Programs
    </h1>
  <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-8">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="flex-1 bg-[#2D3748] border border-[#4A5568] rounded-lg shadow-md p-6 flex flex-col min-w-[220px]"
          >
            <h2 className="text-[#FBBF24] text-xl font-bold mb-3 text-center">
              {pillar.title}
            </h2>
            <div className="flex flex-col gap-4">
              {pillar.items.map((course) => (
                <div
                  key={course.name}
                  className="mb-8 flex flex-col items-center"
                >
                  <Image
                    src={course.image}
                    alt={course.name}
                    width={280}
                    height={60}
                    className="mb-2 rounded-lg object-cover"
                    style={{
                      width: '280px',
                      height: '60px',
                      objectFit: 'cover',
                    }}
                  />
                  <h3 className="text-[#F7FAFC] text-base font-semibold mb-1 text-center">
                    {course.name}
                  </h3>
                  <div className="text-[#CBD5E1] text-sm pl-4 text-left">
                    {course.info.map((info, idx) =>
                      info ? (
                        <div key={idx}>{info}</div>
                      ) : (
                        <div key={idx}>&nbsp;</div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default ThirdContainer;
