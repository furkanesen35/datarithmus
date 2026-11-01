'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  isPasswordValid,
  PASSWORD_REQUIREMENTS,
} from '../../../lib/passwordPolicy';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const [fragmentToken, setFragmentToken] = useState<string | null>(null);
  const token = params.get('token') || fragmentToken;
  const passwordsMatch =
    password.length > 0 && confirm.length > 0 && password === confirm;

  useEffect(() => {
    const tokenFromFragment = new URLSearchParams(
      window.location.hash.slice(1),
    ).get('token');
    if (tokenFromFragment) {
      // The token is only available after reading the client-side URL fragment.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFragmentToken(tokenFromFragment);
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname,
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      setMessage('Please meet all password requirements.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset! You can now log in.');
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setMessage(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="p-8">Invalid or missing token.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#f9f9f9] rounded shadow border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-[#301934]">
        Create New Password
      </h2>
      <p className="mb-4 text-[#301934]/80 text-sm">
        Set your new password below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#301934]">
            New Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-[#301934] bg-white"
            />
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword((visible) => !visible)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#301934]">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-[#301934] bg-white"
            />
            <PasswordVisibilityToggle
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((visible) => !visible)
              }
            />
          </div>
          <ul className="mt-2 space-y-1 text-sm" aria-live="polite">
            {PASSWORD_REQUIREMENTS.map(({ label, test }) => {
              const met = test(password);
              return (
                <li
                  key={label}
                  className={met ? 'text-green-700' : 'text-gray-600'}
                >
                  {met ? '✓' : '○'} {label}
                </li>
              );
            })}
            <li
              className={passwordsMatch ? 'text-green-700' : 'text-gray-600'}
            >
              {passwordsMatch ? '✓' : '○'} Passwords match
            </li>
          </ul>
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Password'}
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-[#301934]">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
