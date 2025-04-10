import '../../globals.css';

function FirstContainer() {
 return (
  <div className="flex flex-col w-full justify-center items-center text-white h-[400px]">
   <h1 className="w-[80%] lg:w-full text-[25px] sm:text-[30px] lg:text-[50px] mb-4 text-center">Your future career in data starts here.</h1>
   <p className="w-[80%] lg:w-full text-[12px] lg:text-[20px] mb-6 text-center">Start training from home. Benefit from a personalized follow-up. Land a new job in Data Science.</p>
   <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-all duration-300 mb-6 cursor-pointer">Book an appointment</button>
   <button className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-950 hover:text-white rounded-md transition-all duration-300 cursor-pointer">Discover all our courses</button>
  </div>
 );
}

export default FirstContainer;