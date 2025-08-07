import '../../globals.css';

export default function PowerBIPl300() {
	return (
		<div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
			<h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">Power BI PL-300</h1>
			<p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">12 weeks ~ 96 hrs</p>
			<div className="w-full max-w-3xl bg-[#e4ed94] rounded-xl shadow-lg p-8 border-2 border-blue-500 mb-8">
				<ul className="list-disc pl-6 text-[#301934] text-lg space-y-2">
					<li>Power BI Fundamentals ~ 16 hours</li>
					<li>Data Preparation & Modeling ~ 16 hours</li>
					<li>Data Visualization & Reporting ~ 16 hours</li>
					<li>DAX & Advanced Analytics ~ 16 hours</li>
					<li>Power BI Service & Deployment ~ 16 hours</li>
					<li>PL-300 Exam Preparation ~ 16 hours</li>
				</ul>
			</div>
			<a href="/enroll" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300">Enroll Now</a>
		</div>
	);
}

