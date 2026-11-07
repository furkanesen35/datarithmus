// packages/client/app/context/AuthContext.tsx
'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: number; email: string; isSuperuser: boolean } | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (id: number, email: string, isSuperuser: boolean) => void;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
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
            user: {
              id: data.id,
              email: data.email,
              isSuperuser: data.isSuperuser,
            },
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

  const login = (id: number, email: string, isSuperuser: boolean) => {
    setAuth({ isLoggedIn: true, user: { id, email, isSuperuser } });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    // Call /api/auth/logout to clear cookies, then redirect
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(
      () => {
        router.push('/auth/login');
      },
    );
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
