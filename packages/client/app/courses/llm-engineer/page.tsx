import '../../globals.css';

export default function LLMEngineer() {
	return (
		<div className="min-h-screen bg-[#301934] w-full flex flex-col items-center py-12 px-4">
			<h1 className="text-5xl font-extrabold text-[#e4ed94] mb-6 text-center drop-shadow-lg">LLM Engineer</h1>
			<p className="text-lg text-[#e4ed94]/80 mb-8 max-w-3xl text-center">Build and fine-tune large language models. Learn the latest techniques in NLP and generative AI.</p>
			<a href="/enroll" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300">Enroll Now</a>
		</div>
	);
}

