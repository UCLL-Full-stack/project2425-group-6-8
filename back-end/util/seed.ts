import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // Users
 const main = async () => {
  // Users
  const users = await prisma.user.createMany({
    data: [
      { name: 'Dagobert Duck', email: 'dagoduck@duckberg.com', nickname: 'Wise Old Geezer', password: 'PassWordOfDagobert123', role: 'ApplicationAdmin' },
      { name: 'Donald Duck', email: 'donald@gmail.com', nickname: 'SuperDonaldd', password: 'PassWordOfDonald123', role: 'user' },
      { name: 'Daisy Duck', email: 'daisy@duckberg.com', nickname: 'Dazzling Daisy', password: 'PassWordOfDaisy123', role: 'user' },
      { name: 'Huey Duck', email: 'huey@duckberg.com', nickname: 'Bright Huey', password: 'PassWordOfHuey123', role: 'user' },
    ],
    skipDuplicates: true,
  });

  console.log('Users seeded:', users.count);

  // Fetch all users
  const usersList = await prisma.user.findMany();

  // Groups with Users
  await prisma.group.create({
    data: {
      id: 10,
      name: 'Household Family',
      users: { connect: [{ id: usersList[0]?.id }, { id: usersList[1]?.id }] }, // Assign Dagobert and Donald
    },
  });

  await prisma.group.create({
    data: {
      id: 11,
      name: 'Camping Crew',
      users: { connect: [{ id: usersList[2]?.id }, { id: usersList[3]?.id }] }, // Assign Daisy and Huey
    },
  });

  await prisma.group.create({
    data: {
      id: 12,
      name: 'Office Snacks Team',
      users: { connect: [{ id: usersList[1]?.id }, { id: usersList[2]?.id }] },
    },
  });

  console.log('Groups with users seeded');

  // Messages
  await prisma.message.create({
    data: {
      message: 'Hello everyone!',
      timestamp: new Date(),
      user: { connect: { id: usersList[0]?.id } },
      group: { connect: { id: 10 } },
    },
  });

  await prisma.message.create({
    data: {
      message: 'Remember the tomatoes!',
      timestamp: new Date(),
      user: { connect: { id: usersList[1]?.id } },
      group: { connect: { id: 12 } },
    },
  });

  console.log('Messages seeded');
};


  // Items
  const items = await prisma.item.createMany({
    data: [
      { name: 'Peanut Butter', description: 'Crunchy peanut butter', consumableType: 'FOOD', price: 2.99, weight: 200, quantity: 1 },
      { name: 'Bread', description: 'Whole grain bread', consumableType: 'FOOD', price: 1.99, quantity: 16 },
      { name: 'Tomatoes', description: 'Fresh tomatoes', consumableType: 'FOOD', price: 3.49, weight: 500, quantity: 10 },
      { name: 'Milk', description: 'Organic whole milk', consumableType: 'DRINK', price: 4.49, weight: 1000, quantity: 2 },
      { name: 'Chicken', description: 'Fresh chicken breast', consumableType: 'FOOD', price: 8.99, weight: 500 },
      { name: 'Apples', description: 'Red apples', consumableType: 'FOOD', price: 2.79, weight: 1000, quantity: 6 },
      { name: 'Rice', description: 'Long grain rice', consumableType: 'FOOD', price: 5.99, weight: 2000, quantity: 1 },
    ],
    skipDuplicates: true,
  });

  console.log('Items seeded:', items.count);

  // Grocery Lists
  const groceryLists = await prisma.groceryList.createMany({
    data: [
      { name: 'Weekly Groceries' },
      { name: 'Party Supplies' },
      { name: 'Camping Essentials' },
      { name: 'Holiday Feast' },
    ],
    skipDuplicates: true,
  });

  console.log('Grocery lists seeded:', groceryLists.count);

  // Groups
  const groups = await prisma.group.createMany({
    data: [
      { id: 1001, name: 'Household Family',  },
      { id: 1002, name: 'Camping Crew' },
      { id: 1003, name: 'Office Snacks Team' },
    ],
    skipDuplicates: true,
  });

  console.log('Groups seeded:', groups.count);

  // Fetch all users and groups
const usersList = await prisma.user.findMany();
const groupsList = await prisma.group.findMany();

  // Messages
  await prisma.message.create({
    data: {
      message: 'Hello everyone!',
      timestamp: new Date(),
      user: { connect: { id: usersList[0]?.id } }, // Connect first user
      group: { connect: { id: groupsList.find(g => g.name === 'Household Family')?.id } }, // Connect group
    },
  });
  await prisma.message.create({
    data: {
      message: 'Remember the tomatoes!',
      timestamp: new Date(),
      user: { connect: { id: usersList[1]?.id } }, // Connect second user
      group: { connect: { id: groupsList.find(g => g.name === 'Household Family')?.id } }, // Connect group
    },
  });

  console.log('Database has been seeded with sample data!');
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
