import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import prisma from '@/lib/prisma';

export const authOptions = {
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30
  },
  session: {
    strategy: 'jwt' as const
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_SECRET
    })
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {}
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export default authHandler;
