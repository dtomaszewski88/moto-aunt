import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';

import prisma from '../lib/prisma';

export type Context = {
  prisma: PrismaClient;
  session: Session | null;
};

export async function createContext(): Promise<Context> {
  const session = await getSession();

  return {
    prisma,
    session
  };
}
