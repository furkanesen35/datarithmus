'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; isSuperuser: boolean } | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, isSuperuser: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, user: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
          email: string;
          isSuperuser: boolean;
        };
        setAuth({ isLoggedIn: true, user: { email: decoded.email, isSuperuser: decoded.isSuperuser } });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setAuth({ isLoggedIn: false, user: null });
      }
    }
  }, []);

  const login = (email: string, isSuperuser: boolean) => {
    const newAuth = { isLoggedIn: true, user: { email, isSuperuser } };
    setAuth(newAuth);
    console.log('Logged in as:', email, 'Superuser:', isSuperuser);
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    localStorage.removeItem('token');
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