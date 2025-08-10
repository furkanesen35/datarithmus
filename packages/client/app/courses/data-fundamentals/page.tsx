import '../../globals.css';
import Link from 'next/link';

export default function DataFundamentals() {
	return (
		<div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
			<h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">Data Fundamentals</h1>
			<p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">10 weeks ~ 100 hrs</p>
			<div className="w-full max-w-3xl bg-[#e4ed94] rounded-xl shadow-lg p-8 border-2 border-blue-500 mb-8">
				<ul className="list-disc pl-6 text-[#301934] text-lg space-y-2">
					<li>Python Basics ~ 14 hours</li>
					<li>Python for Data Science ~ 8 hours</li>
					<li>SQL Basics & Data Warehouses ~ 18 hours</li>
					<li>Statistics Fundamentals ~ 12 hours</li>
					<li>Intro to Power BI & Power Query Basics ~ 14 hours</li>
					<li>Data Modelling  ~ 4 hours</li>
					<li>Excel Basics ~ 10 hours</li>
					<li>IT Literacy ~ 6 hours</li>
					<li>Web Scraping ~ 4 hours</li>
					<li>Git - Github ~ 4 hours</li>
					<li>Personal Brand Building ~ 4 hours</li>
					<li>Career Insights ~ 2 hours</li>
				</ul>
			</div>
					<div className="flex gap-4">
						<Link href="/enroll" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300">Enroll Now</Link>
						<Link href="/" className="px-4 py-2 bg-gray-200 text-[#301934] rounded hover:bg-gray-300 transition-all duration-300 font-semibold">Return to Home</Link>
					</div>
		</div>
	);
}

