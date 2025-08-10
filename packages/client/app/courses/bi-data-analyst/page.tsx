import '../../globals.css';
import Link from 'next/link';

export default function BIDataAnalyst() {
  return (
    <div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">
        BI Data Analyst
      </h1>
      <p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">
        24 weeks ~ 192 hrs
      </p>
      <div className="w-full max-w-3xl bg-[#e4ed94] rounded-xl shadow-lg p-8 border-2 border-blue-500 mb-8">
        <ul className="list-disc pl-6 text-[#301934] text-lg space-y-2">
          <li>Excel for Data Analysis ~ 20 hours</li>
          <li>SQL for BI ~ 20 hours</li>
          <li>Power BI & Data Visualization ~ 32 hours</li>
          <li>Statistics & Data Interpretation ~ 20 hours</li>
          <li>Business Analysis & Reporting ~ 24 hours</li>
          <li>Data Modeling & DAX ~ 24 hours</li>
          <li>ETL & Data Preparation ~ 16 hours</li>
          <li>BI Capstone Project ~ 24 hours</li>
          <li>Soft Skills & Communication ~ 12 hours</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Link
          href="/enroll"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
        >
          Enroll Now
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 text-[#301934] rounded hover:bg-gray-300 transition-all duration-300 font-semibold"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
