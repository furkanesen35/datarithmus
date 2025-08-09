'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordClient() {
  const [tempPassword, setTempPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPassword) {
      setMessage('Temporary password is required.');
      return;
    }
    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, tempPassword, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Password reset! You can now log in.');
      setTimeout(() => router.push('/auth/login'), 1500);
    } else {
      setMessage(data.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  if (!token) {
    return <div className="p-8">Invalid or missing token.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#f9f9f9] rounded shadow border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-[#301934]">Create New Password</h2>
      <p className="mb-4 text-[#301934]/80 text-sm">Set your new password using the temporary password sent to your email.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#301934]">Temporary Password</label>
          <input
            type="password"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-[#301934] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#301934]">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-[#301934] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#301934]">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-[#301934] bg-white"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Password'}
        </button>
        {message && <div className="text-center text-sm mt-2 text-[#301934]">{message}</div>}
      </form>
    </div>
  );
}
