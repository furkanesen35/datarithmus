import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [], // Add your providers here
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'changeme',
};
