"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string } | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously
  const initialAuth = (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('Loaded auth from localStorage:', parsed);
          return parsed;
        } catch (error) {
          console.error('Failed to parse localStorage auth:', error);
          return { isLoggedIn: false, user: null };
        }
      }
    }
    return { isLoggedIn: false, user: null };
  })();

  const [auth, setAuth] = useState<AuthState>(initialAuth);

  // Verify session with backend
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Session verified:', data);
          setAuth({ isLoggedIn: true, user: { email: data.email } });
        } else {
          console.log('No valid session:', data.error);
          setAuth({ isLoggedIn: false, user: null });
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        setAuth({ isLoggedIn: false, user: null });
        localStorage.removeItem('auth');
      }
    };

    verifySession();
  }, []);

  // Save to localStorage on auth change
  useEffect(() => {
    console.log('Saving auth to localStorage:', auth);
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (email: string) => {
    const newAuth = { isLoggedIn: true, user: { email } };
    setAuth(newAuth);
    console.log('Logged in as:', email);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    setAuth({ isLoggedIn: false, user: null });
    localStorage.removeItem('auth');
    console.log('Logged out');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}