// packages/client/app/layout.tsx
import './globals.css';
import '../public/output.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>{/* Removed manual stylesheet link for output.css */}</head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
