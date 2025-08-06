
"use client";
import React, { useState } from 'react';

const EnrollmentPage = () => {
  const [form, setForm] = useState({ name: '', email: '', course: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#301934]">
        <div className="bg-[#e4ed94] rounded-xl shadow-lg p-8 flex flex-col items-center text-[#1c2229] border-2 border-blue-500 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-[#301934]">Thank you for your interest!</h1>
          <p className="text-center text-[#301934]/80">We have received your application. We will contact you if you are selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#301934] px-4">
      <form onSubmit={handleSubmit} className="bg-[#e4ed94] p-8 rounded-xl shadow-lg w-full max-w-md border-2 border-blue-500 flex flex-col items-center text-[#1c2229]">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#301934]">Student Enrollment</h1>
        <label className="block mb-2 font-semibold w-full text-[#301934]">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded border-blue-500 bg-white text-[#1c2229]"
        />
        <label className="block mb-2 font-semibold w-full text-[#301934]">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded border-blue-500 bg-white text-[#1c2229]"
        />
        <label className="block mb-2 font-semibold w-full text-[#301934]">Course</label>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded border-blue-500 bg-white text-[#1c2229]"
        >
          <option value="" disabled>Select a course</option>
          <optgroup label="Courses">
            <option value="Data Fundementals">Data Fundementals</option>
            <option value="BI Data Analyst">BI Data Analyst</option>
            <option value="Analytics Engineer">Analytics Engineer</option>
          </optgroup>
          <optgroup label="Expert Courses (to be announced)">
            <option value="Machine Learning Engineering" disabled>Machine Learning Engineering</option>
            <option value="LLM Engineer" disabled>LLM Engineer</option>
            <option value="Dataops" disabled>Dataops</option>
          </optgroup>
          <optgroup label="Certifications">
            <option value="Power BI PL-300">Power BI PL-300</option>
            <option value="Fabric Enginner">Fabric Enginner</option>
          </optgroup>
        </select>
        <label className="block mb-2 font-semibold w-full text-[#301934]">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="w-full mb-4 px-3 py-2 border rounded border-blue-500 bg-white text-[#1c2229]"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300 mt-2"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default EnrollmentPage;
