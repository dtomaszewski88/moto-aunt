import { PrismaClient } from '@prisma/client';

import prisma from '../lib/prisma';

export type ContextReq = {
  cookies: Record<string, string>;
};

export type ContextArgs = {
  req: ContextReq;
};
export type Context = {
  prisma: PrismaClient;
  sessionId?: string;
};

export async function createContext({ req }: ContextArgs): Promise<Context> {
  const sessionId = req.cookies['next-auth.session-token'];
  return {
    prisma,
    sessionId
  };
}
