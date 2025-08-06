'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailClient() {
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing token.');
      setLoading(false);
      return;
    }
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage('✔ Email verified! Please set your password.');
          setTimeout(() => router.push(`/auth/reset-password?token=${token}`), 3500);
        } else {
          setMessage(data.error || 'Verification failed.');
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('Verification failed.');
        setLoading(false);
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#301934] px-4">
      <div className="bg-[#e4ed94] rounded-xl shadow-lg p-8 flex flex-col items-center text-[#1c2229] border-2 border-blue-500 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#301934]">Email Verification</h2>
        <p className="mb-4 text-center text-[#301934]/80">{message}</p>
        {loading && <div className="text-blue-500">Verifying...</div>}
      </div>
    </div>
  );
}
