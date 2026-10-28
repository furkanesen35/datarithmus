// packages/client/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- Serve the generated stylesheet without routing it through Turbopack's CSS parser. */}
        <link rel="stylesheet" href="/output.css" precedence="default" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
