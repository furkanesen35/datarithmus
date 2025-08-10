'use client';
import Link from 'next/link';
import '../globals.css';
import { useState } from 'react';

const skillsData = [
  'Python Basics',
  'Python for Data Science',
  'SQL Basics',
  'Data Warehouses',
  'Statistics',
  'Power BI',
  'Power Query',
  'Data Modelling',
  'Excel',
  'IT Literacy',
  'Web Scraping',
  'Git & Github',
  'Personal Brand',
  'Career Insights',
  'Data Engineering',
  'ETL',
  'Cloud Platforms',
  'Business Intelligence',
  'DataOps',
  'CI/CD',
  'Orchestration',
  'Governance',
  'NLP',
  'LLM',
  'Machine Learning',
  'Deep Learning',
  'MLOps',
  'Prompt Engineering',
  'Generative AI',
];

const coursesData = [
  {
    name: 'Data Fundamentals',
    skills: [
      'Python Basics',
      'Python for Data Science',
      'SQL Basics',
      'Data Warehouses',
      'Statistics',
      'Power BI',
      'Power Query',
      'Data Modelling',
      'Excel',
      'IT Literacy',
      'Web Scraping',
      'Git & Github',
      'Personal Brand',
      'Career Insights',
    ],
    link: '/courses/data-fundamentals',
  },
  {
    name: 'Analytics Engineer',
    skills: [
      'Python for Data Engineering',
      'SQL Basics',
      'Data Warehouses',
      'ETL',
      'Cloud Platforms',
      'Data Modelling',
      'Business Intelligence',
      'CI/CD',
      'DataOps',
      'Governance',
    ],
    link: '/courses/analytics-engineer',
  },
  {
    name: 'BI Data Analyst',
    skills: [
      'Excel',
      'SQL Basics',
      'Power BI',
      'Statistics',
      'Business Intelligence',
      'Data Modelling',
      'ETL',
      'Personal Brand',
      'Career Insights',
    ],
    link: '/courses/bi-data-analyst',
  },
  {
    name: 'DataOps',
    skills: [
      'DataOps',
      'Orchestration',
      'CI/CD',
      'Cloud Platforms',
      'Automation & Scripting',
      'Governance',
    ],
    link: '/courses/dataops',
  },
  {
    name: 'Fabric Engineer',
    skills: [
      'Microsoft Fabric',
      'ETL',
      'Data Engineering',
      'Data Modelling',
      'Governance',
      'Business Intelligence',
    ],
    link: '/courses/fabric-engineer',
  },
  {
    name: 'LLM Engineer',
    skills: [
      'Python Basics',
      'NLP',
      'LLM',
      'Prompt Engineering',
      'Generative AI',
    ],
    link: '/courses/llm-engineer',
  },
  {
    name: 'Machine Learning Engineer',
    skills: [
      'Python Basics',
      'Machine Learning',
      'Deep Learning',
      'MLOps',
      'Data Modelling',
    ],
    link: '/courses/machine-learning-engineer',
  },
  {
    name: 'Power BI PL-300',
    skills: ['Power BI', 'Data Modelling', 'DAX', 'Business Intelligence'],
    link: '/courses/power-bi-pl-300',
  },
];

export default function Skills() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Find courses that include all selected skills (AND logic)
  const relevantCourses =
    selectedSkills.length > 0
      ? coursesData.filter((course) =>
          selectedSkills.every((skill) => course.skills.includes(skill)),
        )
      : [];

  return (
    <div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">
        Skills
      </h1>
      <p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">
        Explore all skills offered in our career paths. Click a skill to see
        relevant courses!
      </p>
      <Link
        href="/"
        className="mb-8 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-all duration-300"
      >
        Return to Home
      </Link>
      <div className="flex flex-col justify-center items-start w-full max-w-5xl">
        {/* Skill buttons */}
        <div
          className="flex flex-wrap justify-center items-center gap-3 transition-all duration-500 w-full"
          style={{ minHeight: '120px' }}
        >
          {skillsData.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${isSelected ? 'bg-blue-600 text-white scale-110' : 'bg-[#e4ed94] text-[#301934] hover:bg-blue-200 hover:text-blue-900'}`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedSkills(
                      selectedSkills.filter((s) => s !== skill),
                    );
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
              >
                {skill}
              </button>
            );
          })}
        </div>
        {/* Relevant courses as cards */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-col gap-6 w-full items-start mt-8">
            <h2 className="text-2xl font-bold text-[#e4ed94] mb-4">
              Courses with{' '}
              <span className="text-blue-300">{selectedSkills.join(', ')}</span>
              :
            </h2>
            {relevantCourses.length === 0 ? (
              <p className="text-[#e4ed94]">
                No courses found for these skills.
              </p>
            ) : (
              relevantCourses.map((course) => (
                <a
                  key={course.name}
                  href={course.link}
                  className="block w-full bg-[#e4ed94] text-[#301934] rounded-xl shadow-lg p-6 border-2 border-blue-500 hover:bg-blue-100 transition-all duration-300"
                >
                  <span className="text-xl font-bold">{course.name}</span>
                  <div className="mt-2 text-sm">
                    Skills: {course.skills.join(', ')}
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>
      {/* Reset button */}
      {selectedSkills.length > 0 && (
        <button
          className="mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-300"
          onClick={() => setSelectedSkills([])}
        >
          Reset
        </button>
      )}
    </div>
  );
}
