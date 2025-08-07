import '../../globals.css';

export default function LLMEngineer() {
	return (
		<div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
			<h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">LLM Engineer</h1>
			<p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">20 weeks ~ 160 hrs</p>
			<div className="w-full max-w-3xl bg-[#e4ed94] rounded-xl shadow-lg p-8 border-2 border-blue-500 mb-8">
				<ul className="list-disc pl-6 text-[#301934] text-lg space-y-2">
					<li>Python for NLP ~ 20 hours</li>
					<li>Text Preprocessing & Tokenization ~ 16 hours</li>
					<li>Transformer Architectures ~ 24 hours</li>
					<li>Fine-tuning LLMs ~ 24 hours</li>
					<li>Prompt Engineering ~ 16 hours</li>
					<li>Generative AI Applications ~ 24 hours</li>
					<li>LLM Capstone Project ~ 24 hours</li>
					<li>Soft Skills & Communication ~ 8 hours</li>
				</ul>
			</div>
			<a href="/enroll" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300">Enroll Now</a>
		</div>
	);
}

