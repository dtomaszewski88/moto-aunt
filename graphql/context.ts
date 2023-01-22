import { IncomingMessage } from 'http';

import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

import prisma from '../lib/prisma';

export type ContextReq = {
  cookies: Record<string, string>;
} & IncomingMessage;

export type ContextArgs = {
  req: ContextReq;
};
export type Context = {
  prisma: PrismaClient;
  session: Session | null;
  sessionId: string | null;
};

export async function createContext({ req }: ContextArgs): Promise<Context> {
  const sessionId = req.cookies['next-auth.session-token'] ?? null;
  const session = await getSession({ req });

  return {
    prisma,
    sessionId,
    session
  };
}
