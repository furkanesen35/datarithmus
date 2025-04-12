"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { API_URL } from "../../config";

export default function RegisterComponent({ setActiveTab }: { setActiveTab: (tab: "login" | "register") => void }) {
  const { login } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        login(data.email);
        console.log("Register success:", data);
        setMessage("✔ Registration successful, redirecting to login");
        setTimeout(() => {
          window.location.href = '/auth?tab=login'; // Force full reload
        }, 2000);
      } else {
        console.error("Register failed:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        login(data.email);
        console.log("Google register success:", data);
        setMessage("✔ Google registration successful, redirecting to home page");
        setTimeout(() => {
          router.push('/'); // Redirect to home
        }, 2000);
      } else {
        console.error("Google register failed:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during Google registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="512313453952-p1kc0emice0hshj0kv3e976plkeffk7e.apps.googleusercontent.com">
      <div>
        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md text-center flex items-center justify-center">
            <span>{message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <div className="mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error("Google login failed");
                alert("Google registration failed. Please try again.");
              }}
              text="signup_with"
              logo_alignment="center"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}