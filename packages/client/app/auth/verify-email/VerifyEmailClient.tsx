'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailClient() {
  const router = useRouter();
  const params = useSearchParams();
  const verificationStarted = useRef(false);
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }
    const fragmentToken = new URLSearchParams(
      window.location.hash.slice(1),
    ).get('token');
    const token = fragmentToken || params.get('token');
    if (!token) {
      // The verification token may exist only in the client-side URL fragment.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage('Invalid or missing token.');
      setLoading(false);
      return;
    }

    verificationStarted.current = true;
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname,
    );
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage('✔ Email verified! You can now log in.');
          setTimeout(() => router.push('/auth/login'), 3500);
        } else {
          setMessage(data.error || 'Verification failed.');
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('Verification failed.');
        setLoading(false);
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#301934] px-4">
      <div className="bg-[#e4ed94] rounded-xl shadow-lg p-8 flex flex-col items-center text-[#1c2229] border-2 border-blue-500 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#301934]">
          Email Verification
        </h2>
        <p className="mb-4 text-center text-[#301934]/80">{message}</p>
        {loading && <div className="text-blue-500">Verifying...</div>}
      </div>
    </div>
  );
}
