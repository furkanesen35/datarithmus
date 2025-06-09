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
          setMessage('✔ Email verified! You can now log in.');
          setTimeout(() => router.push('/auth/login'), 5000);
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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Verify Email</h2>
      <div className="text-center text-lg">
        {loading ? 'Verifying...' : message}
      </div>
    </div>
  );
}
