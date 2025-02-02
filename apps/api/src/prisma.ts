import { PrismaClient } from '@prisma/client';

// https://stackoverflow.com/questions/75947475/prisma-typeerror-do-not-know-how-to-serialize-a-bigint
BigInt.prototype['toJSON'] = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const prismaclient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export { prismaclient };
