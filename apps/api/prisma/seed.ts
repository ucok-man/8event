import { Role, TicketType } from '@prisma/client';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function SEED_CATEGORY() {
  return await prisma.eventCategory.createMany({
    data: [
      { id: '151e2710-0f16-47a1-b1dc-5a894792bdc2', name: 'children_family' },
      { id: '037a46e9-67a8-4e1b-a22e-ca8280c2f187', name: 'business' },
      {
        id: 'b019bf35-c2be-408b-88e2-e57ad7dd3aa8',
        name: 'design_photo_video',
      },
      { id: '6f23afa2-a421-426d-a814-ee51502e8a37', name: 'fashion_beauty' },
      { id: 'e8906446-0c7f-44f7-9584-ed98c6b86888', name: 'film_cinema' },
      { id: '3cd5540c-d08e-415c-be60-1deef20892ac', name: 'game_esports' },
      { id: '377113c0-318d-4a2b-ab9b-2f2f2c5cab55', name: 'hobby_crafts' },
      { id: '58b059a6-0cf1-4406-9dab-5d7dbb790c58', name: 'investment_stocks' },
      {
        id: 'ed8e3534-4836-4946-ad8e-86627ecf8b95',
        name: 'career_self_development',
      },
      { id: '8d5d15ee-3b91-46b1-9b4c-aee9206db87e', name: 'religion' },
      { id: '0fda353f-1265-448e-a0fe-4827f940370a', name: 'health_fitness' },
      { id: '08a19e78-e985-415c-90e5-7bf711bb123a', name: 'finance' },
      { id: '6f9d4a6c-70d8-4d27-87e8-4c589a5b0082', name: 'environment' },
      { id: '421a51c0-f77d-4d86-9810-151c8e30d823', name: 'food_drinks' },
      { id: 'c14502f1-f690-4024-80de-6e1e540fbaed', name: 'marketing' },
      { id: '30e0d778-e66e-4250-92c2-c35ba1323eb0', name: 'music' },
      { id: '411708d2-c5ce-4b9b-8bf5-0c782cac11f8', name: 'sports' },
      { id: '83a02d08-d65a-4e2c-a43f-dd1695364bbb', name: 'automotive' },
      {
        id: 'f2177166-07ec-4169-9867-69d6ead067fb',
        name: 'science_technology',
      },
      { id: '426588c8-0ec9-4f1f-a8d0-1163a3d7cbb6', name: 'arts_culture' },
      {
        id: '5bf56ae0-74a4-4735-a7ff-a68d253cbaf1',
        name: 'social_law_politics',
      },
      { id: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', name: 'standup_comedy' },
      {
        id: '4699d695-e405-44c4-9e26-29e74e20ae65',
        name: 'education_scholarships',
      },
      { id: '09a2b96b-2292-4a93-aec6-a0c59a5cb24e', name: 'tech_startup' },
      { id: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', name: 'travel_holidays' },
      { id: '71896639-a9e4-4699-9a12-7cd139525cd9', name: 'others' },
    ],
  });
}

async function SEED_EVENTS_AND_TICKETS(organizerId: string) {
  const events = [
    // Active Event 1
    {
      id: '1fbcf999-c0bc-4103-bd2b-fa0e890c2f06',
      name: 'Tech Startup Conference 2023',
      bannerUrl: 'https://example.com/tech-conference.jpg',
      description:
        '<p>Join us for the biggest tech startup conference of the year! Learn from industry leaders and network with like-minded entrepreneurs.</p>',
      startDate: new Date('2023-12-15'),
      endDate: new Date('2023-12-16'),
      startTime: '09:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Convention Center',
      placeCity: 'San Francisco',
      placeAddress: '123 Tech Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '09a2b96b-2292-4a93-aec6-a0c59a5cb24e', // tech_startup
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2023-12-15'),
          endDate: new Date('2023-12-16'),
          startTime: '09:00',
          endTime: '18:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'Regular',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2023-12-15'),
          endDate: new Date('2023-12-16'),
          startTime: '09:00',
          endTime: '18:00',
          price: 299.99,
        },
      ],
    },
    // Draft Event 2
    {
      id: 'db811713-8070-47bf-b16f-b7cfcc0363d0',
      name: 'Future of AI Workshop',
      bannerUrl: 'https://example.com/ai-workshop.jpg',
      description:
        '<p>Explore the future of artificial intelligence in this hands-on workshop. Perfect for developers and data scientists.</p>',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-21'),
      startTime: '10:00',
      endTime: '16:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/ai-workshop-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'f2177166-07ec-4169-9867-69d6ead067fb', // science_technology
      tickets: [
        {
          type: TicketType.FREE,
          name: 'General Admission',
          description: 'Access to all sessions',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2024-01-20'),
          endDate: new Date('2024-01-21'),
          startTime: '10:00',
          endTime: '16:00',
          price: null,
        },
      ],
    },
    // Past Event 3
    {
      id: '7c3e05ca-0386-4c7e-9fde-2b02256bba0a',
      name: 'Music Festival 2023',
      bannerUrl: 'https://example.com/music-festival.jpg',
      description:
        '<p>Relive the magic of the 2023 Music Festival! Featuring top artists from around the world.</p>',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2023-07-02'),
      startTime: '12:00',
      endTime: '23:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Central Park',
      placeCity: 'New York',
      placeAddress: '456 Music Avenue',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '30e0d778-e66e-4250-92c2-c35ba1323eb0', // music
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Front-row access and exclusive lounge',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-07-01'),
          endDate: new Date('2023-07-02'),
          startTime: '12:00',
          endTime: '23:00',
          price: 499.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all stages',
          initialAmount: 500,
          amount: 500,
          startDate: new Date('2023-07-01'),
          endDate: new Date('2023-07-02'),
          startTime: '12:00',
          endTime: '23:00',
          price: 149.99,
        },
      ],
    },
    // Active Event 4
    {
      id: 'df48b184-c227-43e2-8948-03f274f6417c',
      name: 'Fitness Bootcamp 2024',
      bannerUrl: 'https://example.com/fitness-bootcamp.jpg',
      description:
        '<p>Kickstart your fitness journey with our intensive bootcamp. Suitable for all levels.</p>',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-12'),
      startTime: '07:00',
      endTime: '09:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'City Gym',
      placeCity: 'Los Angeles',
      placeAddress: '789 Fitness Road',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '0fda353f-1265-448e-a0fe-4827f940370a', // health_fitness
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Standard Pass',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2024-02-10'),
          endDate: new Date('2024-02-12'),
          startTime: '07:00',
          endTime: '09:00',
          price: 99.99,
        },
      ],
    },
    // Draft Event 5
    {
      id: 'bbd8cdc6-d2a5-4186-9ec5-143db4861ae4',
      name: 'Digital Marketing Masterclass',
      bannerUrl: 'https://example.com/digital-marketing.jpg',
      description:
        '<p>Learn the latest strategies in digital marketing from industry experts.</p>',
      startDate: new Date('2024-03-05'),
      endDate: new Date('2024-03-06'),
      startTime: '13:00',
      endTime: '17:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/digital-marketing-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'c14502f1-f690-4024-80de-6e1e540fbaed', // marketing
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2024-03-05'),
          endDate: new Date('2024-03-06'),
          startTime: '13:00',
          endTime: '17:00',
          price: 149.99,
        },
      ],
    },
    // Past Event 6
    {
      id: '02beac31-4efe-4c5e-bfc3-19010dc739e6',
      name: 'Food & Wine Festival 2023',
      bannerUrl: 'https://example.com/food-wine.jpg',
      description:
        '<p>Experience the finest cuisines and wines from around the world.</p>',
      startDate: new Date('2023-05-20'),
      endDate: new Date('2023-05-21'),
      startTime: '11:00',
      endTime: '20:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Downtown Plaza',
      placeCity: 'Chicago',
      placeAddress: '101 Gourmet Lane',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '421a51c0-f77d-4d86-9810-151c8e30d823', // food_drinks
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Exclusive tastings and lounge access',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-05-20'),
          endDate: new Date('2023-05-21'),
          startTime: '11:00',
          endTime: '20:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all tastings',
          initialAmount: 300,
          amount: 300,
          startDate: new Date('2023-05-20'),
          endDate: new Date('2023-05-21'),
          startTime: '11:00',
          endTime: '20:00',
          price: 99.99,
        },
      ],
    },
    // Active Event 7
    {
      id: '90bd2b62-f545-473b-9c13-d84f64a9db3b',
      name: 'Environmental Sustainability Summit',
      bannerUrl: 'https://example.com/environment-summit.jpg',
      description:
        '<p>Join global leaders in discussing solutions for a sustainable future.</p>',
      startDate: new Date('2024-04-22'),
      endDate: new Date('2024-04-23'),
      startTime: '10:00',
      endTime: '16:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Green Convention Center',
      placeCity: 'Seattle',
      placeAddress: '202 Eco Drive',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '6f9d4a6c-70d8-4d27-87e8-4c589a5b0082', // environment
      tickets: [
        {
          type: TicketType.FREE,
          name: 'General Admission',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2024-04-22'),
          endDate: new Date('2024-04-23'),
          startTime: '10:00',
          endTime: '16:00',
          price: null,
        },
      ],
    },
    // Draft Event 8
    {
      id: '9f1a9e74-8e4b-4b3f-bbc1-f63a6238d4f9',
      name: 'Photography Workshop',
      bannerUrl: 'https://example.com/photography-workshop.jpg',
      description:
        '<p>Learn the art of photography from professional photographers.</p>',
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-05-16'),
      startTime: '09:00',
      endTime: '15:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/photography-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'b019bf35-c2be-408b-88e2-e57ad7dd3aa8', // design_photo_video
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Standard Pass',
          description: 'Access to all sessions',
          initialAmount: 30,
          amount: 30,
          startDate: new Date('2024-05-15'),
          endDate: new Date('2024-05-16'),
          startTime: '09:00',
          endTime: '15:00',
          price: 79.99,
        },
      ],
    },
    // Past Event 9
    {
      id: '3f6f4bc0-6f55-4ed3-9d91-9da0a4092451',
      name: 'Stand-Up Comedy Night',
      bannerUrl: 'https://example.com/comedy-night.jpg',
      description:
        '<p>Laugh your heart out with the best comedians in town!</p>',
      startDate: new Date('2023-06-10'),
      endDate: new Date('2023-06-10'),
      startTime: '19:00',
      endTime: '22:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Laugh Factory',
      placeCity: 'Las Vegas',
      placeAddress: '303 Comedy Road',
      isPublished: true,
      organizerId: organizerId,
      categoryId: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', // standup_comedy
      tickets: [
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to the show',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2023-06-10'),
          endDate: new Date('2023-06-10'),
          startTime: '19:00',
          endTime: '22:00',
          price: 49.99,
        },
      ],
    },
    // Active Event 10
    {
      id: '7e07e91d-a428-4578-83c1-2a7838973fd1',
      name: 'Blockchain & Crypto Conference',
      bannerUrl: 'https://example.com/blockchain-conference.jpg',
      description:
        '<p>Discover the future of blockchain technology and cryptocurrencies.</p>',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-02'),
      startTime: '09:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Tech Hub',
      placeCity: 'Austin',
      placeAddress: '404 Blockchain Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '58b059a6-0cf1-4406-9dab-5d7dbb790c58', // investment_stocks
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-02'),
          startTime: '09:00',
          endTime: '18:00',
          price: 299.99,
        },
        {
          type: TicketType.PAID,
          name: 'Regular',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-02'),
          startTime: '09:00',
          endTime: '18:00',
          price: 399.99,
        },
      ],
    },
    // Draft Event 11
    {
      id: '12ed7b7c-a655-460b-bc71-fd8f9d391e99',
      name: 'Art Exhibition: Modern Masters',
      bannerUrl: 'https://example.com/art-exhibition.jpg',
      description:
        '<p>Explore the works of modern art masters in this exclusive exhibition.</p>',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-12'),
      startTime: '10:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Art Gallery',
      placeCity: 'Paris',
      placeAddress: '505 Art Avenue',
      isPublished: false,
      organizerId: organizerId,
      categoryId: '426588c8-0ec9-4f1f-a8d0-1163a3d7cbb6', // arts_culture
      tickets: [
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to the exhibition',
          initialAmount: 150,
          amount: 150,
          startDate: new Date('2024-07-10'),
          endDate: new Date('2024-07-12'),
          startTime: '10:00',
          endTime: '18:00',
          price: 29.99,
        },
      ],
    },
    // Past Event 12
    {
      id: '9105f166-aef5-4891-8cee-bda767d4d964',
      name: 'E-Sports Tournament 2023',
      bannerUrl: 'https://example.com/esports-tournament.jpg',
      description:
        '<p>Relive the excitement of the 2023 E-Sports Tournament featuring top gamers.</p>',
      startDate: new Date('2023-08-15'),
      endDate: new Date('2023-08-16'),
      startTime: '12:00',
      endTime: '22:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Gaming Arena',
      placeCity: 'Tokyo',
      placeAddress: '606 Game Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '3cd5540c-d08e-415c-be60-1deef20892ac', // game_esports
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Front-row seating and exclusive perks',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-08-15'),
          endDate: new Date('2023-08-16'),
          startTime: '12:00',
          endTime: '22:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all matches',
          initialAmount: 500,
          amount: 500,
          startDate: new Date('2023-08-15'),
          endDate: new Date('2023-08-16'),
          startTime: '12:00',
          endTime: '22:00',
          price: 99.99,
        },
      ],
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: {
        id: event.id,
        name: event.name,
        bannerUrl: event.bannerUrl,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        isEventOnline: event.isEventOnline,
        urlStreaming: event.urlStreaming,
        placeName: event.placeName,
        placeCity: event.placeCity,
        placeAddress: event.placeAddress,
        isPublished: event.isPublished,
        organizerId: event.organizerId,
        categoryId: event.categoryId,
        tickets: {
          createMany: {
            data: event.tickets,
          },
        },
      },
    });
  }
}

async function SEED_USER(): Promise<{
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
  const { userid, organizerid } = await SEED_USER();
  const {} = await addPointBalance(userid);
  await SEED_EVENTS_AND_TICKETS(organizerid);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
