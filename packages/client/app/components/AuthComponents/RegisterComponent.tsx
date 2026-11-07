// packages/client/app/components/AuthComponents/RegisterComponent.tsx
'use client';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import {
  isPasswordValid,
  PASSWORD_REQUIREMENTS,
} from '../../../lib/passwordPolicy';
import { isEmailValid } from '../../../lib/formValidation';
import PasswordVisibilityToggle from '../PasswordVisibilityToggle';

export default function RegisterComponent() {
  const { login } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get('username') as string;
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isPasswordValid(password)) {
      setError('Please meet all password requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok && data.emailSent === false) {
        // Account exists but the email failed; the error text below shows the resend button.
        setMessage(null);
        setError(
          'Your account was created, but we could not send the verification email.',
        );
      } else if (response.ok) {
        setMessage(
          '✔ Registration successful! Please check your email to verify your account.',
        );
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      setError(null);
      if (!credentialResponse.credential) {
        setError('Google credential missing.');
        return;
      }
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.id, data.email, data.isSuperuser);
        setMessage('✔ Google registration successful, redirecting...');
        setTimeout(
          () => router.push(data.isSuperuser ? '/admin' : '/dashboard'),
          5000,
        ); // 5 seconds for better UX
      } else {
        setError(data.error);
      }
    } catch {
      setError(
        'Could not contact the sign-in service. Check your connection and try again.',
      );
    }
  };

  return (
    <div>
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            ← Back to main page
          </Link>
        </div>
        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md text-center flex items-center justify-center">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center">
            <span>{error}</span>
            {error && error.includes('verification email') && (
              <button
                className="ml-2 underline text-blue-600 hover:text-blue-800"
                onClick={async () => {
                  setError(null);
                  setMessage('Resending verification email...');
                  const email = (
                    document.getElementById('email') as HTMLInputElement
                  )?.value;
                  if (!email) {
                    setError('Please enter your email above.');
                    setMessage(null);
                    return;
                  }
                  const res = await fetch('/api/auth/resend-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setMessage(
                      'Verification email resent! Please check your inbox.',
                    );
                  } else {
                    setError(
                      data.error || 'Could not resend verification email.',
                    );
                  }
                }}
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(email) && !isEmailValid(email)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
            {email && (
              <p
                className={`mt-1 text-sm ${
                  isEmailValid(email) ? 'text-green-700' : 'text-red-600'
                }`}
                aria-live="polite"
              >
                {isEmailValid(email)
                  ? 'Valid email address.'
                  : 'Enter a valid email address (for example, name@example.com).'}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              />
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword((visible) => !visible)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
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
                className={
                  passwordsMatch ? 'text-green-700' : 'text-gray-600'
                }
              >
                {passwordsMatch ? '✓' : '○'} Passwords match
              </li>
            </ul>
          </div>
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setError('Google registration failed. Please try again.')
              }
              text="signup_with"
              logo_alignment="center"
              size="large"
              shape="circle"
              width={300}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
    </div>
  );
}
