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
  console.log('Users seeded.');

  const users = await prisma.user.findMany();

  // Seed Groups
  const groupsData = [
    {
      id: 10,
      name: 'Household Family',
      userGroups: [
        { userId: users[1]?.id, role: 'GroupAdmin' },
        { userId: users[2]?.id, role: 'user' },
      ],
    },
    {
      id: 11,
      name: 'Camping Crew',
      userGroups: [
        { userId: users[2]?.id, role: 'GroupAdmin' },
        { userId: users[3]?.id, role: 'user' },
      ],
    },
    {
      id: 12,
      name: 'Work Team',
      userGroups: [
        { userId: users[0]?.id, role: 'GroupAdmin' },
        { userId: users[1]?.id, role: 'user' },
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
    { name: 'Peanut Butter', description: 'Crunchy peanut butter', consumableType: 'FOOD', price: 2.99, weight: 200, quantity: 1, isCompleted: false },
    { name: 'Bread', description: 'Whole grain bread', consumableType: 'FOOD', price: 1.99, quantity: 16, isCompleted: false },
    { name: 'Tomatoes', description: 'Fresh tomatoes', consumableType: 'FOOD', price: 3.49, weight: 500, quantity: 10, isCompleted: false },
    { name: 'Milk', description: 'Organic whole milk', consumableType: 'DRINK', price: 4.49, weight: 1000, quantity: 2, isCompleted: false },
    { name: 'Chicken', description: 'Fresh chicken breast', consumableType: 'FOOD', price: 8.99, weight: 500, isCompleted: false },
    { name: 'Apples', description: 'Red apples', consumableType: 'FOOD', price: 2.79, weight: 1000, quantity: 6, isCompleted: false },
    { name: 'Rice', description: 'Long grain rice', consumableType: 'FOOD', price: 5.99, weight: 2000, quantity: 1, isCompleted: false },
  ];

  await prisma.item.createMany({
    data: itemsData,
    skipDuplicates: true,
  });
  console.log('Items seeded.');

  const items = await prisma.item.findMany();

  // Seed Grocery Lists
  const groceryListsData = [
    {
      name: 'Family Weekly Groceries',
      groupId: groupsData[0].id,
      itemIds: [items[0]?.id, items[1]?.id],
    },
    {
      name: 'Camping Essentials',
      groupId: groupsData[1].id,
      itemIds: [items[2]?.id, items[3]?.id],
    },
    {
      name: 'Work Lunches',
      groupId: groupsData[2].id,
      itemIds: [items[4]?.id, items[5]?.id, items[6]?.id],
    },
  ];

  for (const groceryList of groceryListsData) {
    await prisma.groceryList.create({
      data: {
        name: groceryList.name,
        groupId: groceryList.groupId,
        items: {
          connect: groceryList.itemIds.map((itemId) => ({ id: itemId })),
        },
      },
    });
  }
  console.log('Grocery lists seeded.');

  // Seed Messages
  const messagesData = [
    { message: 'Can someone buy bread?', userId: users[1].id, groupId: groupsData[0].id },
    { message: 'I got some milk today', userId: users[2].id, groupId: groupsData[0].id },
    { message: 'Man you guys dont buy those items by the week you can make dinner yourself', userId: users[3].id, groupId: groupsData[1].id },
    { message: 'Should we get some chicken for the weekend?', userId: users[0].id, groupId: groupsData[0].id },
    { message: 'I’ll bring the eggs tomorrow, long day at work christmas troubles you feel me', userId: users[1].id, groupId: groupsData[2].id },
    { message: 'Just bought some oranges for breakfast, oranges were crazy big, might sell sum orange juice', userId: users[2].id, groupId: groupsData[2].id },
  ];

  for (const message of messagesData) {
    await prisma.message.create({
      data: {
        message: message.message,
        userId: message.userId,  
        groupId: message.groupId, 
      },
    });
  }
  console.log('Messages seeded.');

  const itemCount = await prisma.item.count();
  const groceryListCount = await prisma.groceryList.count();
  const messageCount = await prisma.message.count();

  console.log(`Items seeded: ${itemCount}`);
  console.log(`Grocery lists seeded: ${groceryListCount}`);
  console.log(`Messages seeded: ${messageCount}`);
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
