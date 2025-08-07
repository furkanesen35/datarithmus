import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const certifications = [
  {
    title: 'Power BI PL-300',
    image: '/images/Data_Science.jpg',
    description: 'Microsoft Power BI Data Analyst Certification.',
  },
  {
    title: 'Fabric Engineer',
    image: '/images/Big-Data-analytics.jpg',
    description: 'Microsoft Fabric Engineer Certification.',
  },
];

const CertificationsTab = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 text-black">Certifications</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {certifications.map((cert) => {
        let link = '';
        if (cert.title === 'Power BI PL-300') link = '/courses/power-bi-pl-300';
        if (cert.title === 'Fabric Engineer') link = '/courses/fabric-engineer';
        return (
          <Link href={link} key={cert.title} className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center w-[260px] h-[220px] cursor-pointer hover:shadow-lg transition">
            <Image
              src={cert.image}
              alt={cert.title}
              width={140}
              height={90}
              className="rounded mb-3 object-cover"
              style={{ width: '140px', height: '90px' }}
            />
            <h3 className="text-lg font-semibold mb-1 text-black">
              {cert.title}
            </h3>
            <p className="text-sm text-black text-center">{cert.description}</p>
          </Link>
        );
      })}
    </div>
  </div>
);

export default CertificationsTab;
