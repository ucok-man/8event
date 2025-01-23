import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedUser(): Promise<{
  userid: string;
  organizerid: string;
}> {
  const organizerId = uuidv4();
  const userId = uuidv4();

  await prisma.user.create({
    data: {
      id: organizerId,
      name: 'John Doe',
      email: 'john@john.com',
      password: '12345678',
      profilePicture: 'https://example.com/profile.jpg',
      role: Role.ORGANIZER,
      pointsBalance: 0,
      referralCode: 'REFCODE' + organizerId,
    },
  });

  await prisma.user.create({
    data: {
      id: userId,
      name: 'Alice Chan',
      email: 'alice@alice.com',
      password: '12345678',
      profilePicture: 'https://example.com/profile.jpg',
      role: Role.CUSTOMER,
      pointsBalance: 20000,
      referralCode: 'REFCODE' + userId,
    },
  });

  return {
    organizerid: organizerId,
    userid: userId,
  };
}

async function main() {
  const {} = await seedUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
