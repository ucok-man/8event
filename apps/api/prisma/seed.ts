import { Role } from '@prisma/client';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function SEED_CATEGORY() {
  await prisma.eventCategory.deleteMany({
    where: {
      OR: [
        { name: 'children_family' },
        { name: 'business' },
        { name: 'design_photo_video' },
        { name: 'fashion_beauty' },
        { name: 'film_cinema' },
        { name: 'game_esports' },
        { name: 'hobby_crafts' },
        { name: 'investment_stocks' },
        { name: 'career_self_development' },
        { name: 'religion' },
        { name: 'health_fitness' },
        { name: 'finance' },
        { name: 'environment' },
        { name: 'food_drinks' },
        { name: 'marketing' },
        { name: 'music' },
        { name: 'sports' },
        { name: 'automotive' },
        { name: 'science_technology' },
        { name: 'arts_culture' },
        { name: 'social_law_politics' },
        { name: 'standup_comedy' },
        { name: 'education_scholarships' },
        { name: 'tech_startup' },
        { name: 'travel_holidays' },
        { name: 'others' },
      ],
    },
  });

  return await prisma.eventCategory.createMany({
    data: [
      { name: 'children_family' },
      { name: 'business' },
      { name: 'design_photo_video' },
      { name: 'fashion_beauty' },
      { name: 'film_cinema' },
      { name: 'game_esports' },
      { name: 'hobby_crafts' },
      { name: 'investment_stocks' },
      { name: 'career_self_development' },
      { name: 'religion' },
      { name: 'health_fitness' },
      { name: 'finance' },
      { name: 'environment' },
      { name: 'food_drinks' },
      { name: 'marketing' },
      { name: 'music' },
      { name: 'sports' },
      { name: 'automotive' },
      { name: 'science_technology' },
      { name: 'arts_culture' },
      { name: 'social_law_politics' },
      { name: 'standup_comedy' },
      { name: 'education_scholarships' },
      { name: 'tech_startup' },
      { name: 'travel_holidays' },
      { name: 'others' },
    ],
  });
}

async function seedUser(): Promise<{
  userid: string;
  organizerid: string;
}> {
  const organizerId = '4369549d-8056-4138-a1cf-5139f7527f0d';
  const userId = 'bc1a6307-6471-4b3b-b8a4-3aa2bb62c1f5';

  await prisma.user.create({
    data: {
      id: organizerId,
      name: 'John Doe',
      email: 'john@john.com',
      password: '12345678',
      profilePicture: 'https://example.com/profile.jpg',
      role: Role.ORGANIZER,
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
      referralCode: 'REFCODE' + userId,
    },
  });

  return {
    organizerid: organizerId,
    userid: userId,
  };
}

async function addPointBalance(userId: string) {
  const cd = new Date();
  await prisma.pointBalance.create({
    data: {
      pointBalance: 20000,
      type: 'ADD',
      userId: userId,
      endDate: new Date(cd.setMonth(cd.getMonth() + 3)),
    },
  });
  await prisma.pointBalance.create({
    data: {
      pointBalance: -5000,
      type: 'SUBSTRACT',
      userId: userId,
      endDate: new Date(cd.setMonth(cd.getMonth() + 3)),
    },
  });
  await prisma.pointBalance.create({
    data: {
      pointBalance: 10000,
      type: 'ADD',
      userId: userId,
      endDate: new Date(cd.setMonth(cd.getMonth() + 3)),
    },
  });
  return { userId };
}

async function main() {
  const {} = await SEED_CATEGORY();
  const { userid, organizerid } = await seedUser();
  const {} = await addPointBalance(userid);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
