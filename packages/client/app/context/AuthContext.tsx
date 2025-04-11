"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string } | null;
  token: string | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, user: null, token: null };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (email: string, token: string) => {
    setAuth({ isLoggedIn: true, user: { email }, token });
    console.log('Logged in as:', email);
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null, token: null });
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