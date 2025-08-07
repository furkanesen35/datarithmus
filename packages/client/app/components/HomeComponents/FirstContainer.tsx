// packages/client/app/components/HomeComponents/FirstContainer.tsx
import '../../globals.css';

function FirstContainer() {
  return (
    <div className="flex flex-col w-full justify-center items-center h-[400px] bg-[#1A202C] text-[#E2E8F0]">
      <h1 className="w-[80%] lg:w-full text-[25px] sm:text-[30px] lg:text-[50px] mb-4 text-center font-bold text-[#E2E8F0]">
        Your future career in data starts here.
      </h1>
      <p className="w-[80%] lg:w-full text-[12px] lg:text-[20px] mb-6 text-center text-[#E2E8F0]">
        Start training from home. Benefit from a personalized follow-up. Land a
        new job in Data Science.
      </p>
      <button className="px-4 py-2 bg-blue-500 text-[#E2E8F0] hover:bg-blue-600 rounded-md transition-all duration-300 mb-6 cursor-pointer font-semibold">
        Book an appointment
      </button>
      <button className="px-4 py-2 border-2 border-[#9F7AEA] text-[#9F7AEA] hover:bg-[#2D3748] hover:text-[#E2E8F0] rounded-md transition-all duration-300 cursor-pointer font-semibold">
        Discover all our courses
      </button>
    </div>
  );
}

export default FirstContainer;
