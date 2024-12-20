import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const main = async () => {
  // Seed Users
  const usersData = [
    {
      name: 'Dagobert Duck',
      email: 'dagoduck@duckberg.com',
      nickname: 'Wise Old Geezer',
      password: 'PassWordOfDagobert123',
      globalRole: 'ApplicationAdmin',
    },
    {
      name: 'Donald Duck',
      email: 'donald@gmail.com',
      nickname: 'SuperDonaldd',
      password: 'PassWordOfDonald123',
      globalRole: 'user',
    },
    {
      name: 'Daisy Duck',
      email: 'daisy@duckberg.com',
      nickname: 'Dazzling Daisy',
      password: 'PassWordOfDaisy123',
      globalRole: 'user',
    },
    {
      name: 'Huey Duck',
      email: 'huey@duckberg.com',
      nickname: 'Bright Huey',
      password: 'PassWordOfHuey123',
      globalRole: 'user',
    },
  ];

  const hashedUsersData = await Promise.all(
    usersData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
    }))
  );

  await prisma.user.createMany({
    data: hashedUsersData,
    skipDuplicates: true,
  });
  console.log('Users seeded with hashed passwords.');

  // Fetch all users
  const users = await prisma.user.findMany();

  // Seed Groups
  const groupsData = [
    {
      id: 10,
      name: 'Household Family',
      userGroups: [
        { userId: users[0]?.id, role: 'GroupAdmin' }, // Assign Dagobert as admin
        { userId: users[1]?.id, role: 'user' },       // Assign Donald as a user
      ],
    },
    {
      id: 11,
      name: 'Camping Crew',
      userGroups: [
        { userId: users[2]?.id, role: 'GroupAdmin' }, // Assign Daisy as admin
        { userId: users[3]?.id, role: 'user' },       // Assign Huey as a user
      ],
    },
    {
      id: 12,
      name: 'Office Snacks Team',
      userGroups: [
        { userId: users[1]?.id, role: 'GroupAdmin' }, // Assign Donald as admin
        { userId: users[2]?.id, role: 'user' },       // Assign Daisy as a user
      ],
    },
  ];

  for (const group of groupsData) {
    await prisma.group.create({
      data: {
        id: group.id,
        name: group.name,
        userGroups: {
          create: group.userGroups,
        },
      },
    });
  }
  console.log('Groups seeded.');

  // Seed Items
  const itemsData = [
    { name: 'Peanut Butter', description: 'Crunchy peanut butter', consumableType: 'FOOD', price: 2.99, weight: 200, quantity: 1 },
    { name: 'Bread', description: 'Whole grain bread', consumableType: 'FOOD', price: 1.99, quantity: 16 },
    { name: 'Tomatoes', description: 'Fresh tomatoes', consumableType: 'FOOD', price: 3.49, weight: 500, quantity: 10 },
    { name: 'Milk', description: 'Organic whole milk', consumableType: 'DRINK', price: 4.49, weight: 1000, quantity: 2 },
    { name: 'Chicken', description: 'Fresh chicken breast', consumableType: 'FOOD', price: 8.99, weight: 500 },
    { name: 'Apples', description: 'Red apples', consumableType: 'FOOD', price: 2.79, weight: 1000, quantity: 6 },
    { name: 'Rice', description: 'Long grain rice', consumableType: 'FOOD', price: 5.99, weight: 2000, quantity: 1 },
  ];

  await prisma.item.createMany({
    data: itemsData,
    skipDuplicates: true,
  });
  console.log('Items seeded.');

  // Seed Messages
  const groups = await prisma.group.findMany();
  await prisma.message.createMany({
    data: [
      {
        message: 'Hello everyone!',
        timestamp: new Date(),
        userId: users[0]?.id,
        groupId: groups.find((g) => g.name === 'Household Family')?.id as number,
      },
      {
        message: 'Remember the tomatoes!',
        timestamp: new Date(),
        userId: users[1]?.id,
        groupId: groups.find((g) => g.name === 'Household Family')?.id as number,
      },
    ],
  });
  console.log('Messages seeded.');
};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during seeding:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
