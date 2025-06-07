// packages/client/app/context/AuthContext.tsx
'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; isSuperuser: boolean } | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, isSuperuser: boolean) => void;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check authentication by calling /api/me (server verifies cookie)
    async function checkAuth() {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setAuth({
            isLoggedIn: true,
            user: { email: data.email, isSuperuser: data.isSuperuser },
          });
        } else {
          setAuth({ isLoggedIn: false, user: null });
        }
      } catch {
        setAuth({ isLoggedIn: false, user: null });
      } finally {
        setIsAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (email: string, isSuperuser: boolean) => {
    setAuth({ isLoggedIn: true, user: { email, isSuperuser } });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    // Optionally, call /api/auth/logout to clear cookie
    fetch('/api/auth/logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
