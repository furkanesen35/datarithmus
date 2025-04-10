import React from 'react';

function ThirdContainer() {
 const cardsData = [
  { title: "Data Science Bootcamp", description: "Learn Data Science from scratch.", link: "/data-science", image:"/images/Data_Science.jpg" },
  { title: "Machine Learning Course", description: "Master ML algorithms and techniques.", link: "/machine-learning", image:"/images/Machine_Learning.jpg" },
  { title: "Python for Data Analysis", description: "Dive into data manipulation with Python.", link: "/python-data", image:"/images/Python-for-data-analysis.jpg" },
  { title: "Big Data Analytics", description: "Explore big data technologies and applications.", link: "/big-data", image:"/images/Big-Data-analytics.jpg"}
 ];

 return (
  <div className="container mx-auto my-8">
   <h1 className='text-white p-[5px] font-bold text-2xl'>Career Paths</h1>
   <p className='text-white p-[5px]'>The business courses train beginners in the data business.</p>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {cardsData.map((card, index) => (
     <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <a href={card.link}>
       <img className="w-full h-48 object-cover" src={card?.image} alt={card.title} />
      </a>
      <div className="p-4">
       <h3 className="text-[orange] text-xl font-semibold mb-2">{card.title}</h3>
       <p className="text-gray-700 text-base mb-4">{card.description}</p>
       <a href={card.link} className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Learn More</a>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}

export default ThirdContainer;