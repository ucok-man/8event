import { PrismaClient } from '@prisma/client';

const prismaclient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export { prismaclient };
