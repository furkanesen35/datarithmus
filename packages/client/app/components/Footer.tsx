import React from 'react';

const Footer = () => (
  <footer className="w-full bg-black text-[#E2E8F0] py-8 flex flex-col items-center border-t border-[#4A5568] mt-8">
    <div className="max-w-5xl w-full px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <span className="font-bold text-lg">Datarithmus</span>
        <span className="block text-sm mt-1">Empowering your data career</span>
      </div>
      <div className="flex gap-6 text-sm">
        <a href="/about" className="hover:text-[#FBBF24] transition">About Us</a>
        <a href="/contact" className="hover:text-[#FBBF24] transition">Contact</a>
      </div>
      <div className="mt-4 md:mt-0 text-center md:text-right text-xs">
        &copy; {new Date().getFullYear()} Datarithmus. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
