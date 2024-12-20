import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const main = async () => {
  // Seed Users
  const users = [
    { name: 'Dagobert Duck', email: 'dagoduck@duckberg.com', nickname: 'Wise Old Geezer', password: 'PassWordOfDagobert123', role: 'ApplicationAdmin' },
    { name: 'Donald Duck', email: 'donald@gmail.com', nickname: 'SuperDonald', password: 'PassWordOfDonald123', role: 'user' },
    { name: 'Daisy Duck', email: 'daisy@duckberg.com', nickname: 'Dazzling Daisy', password: 'PassWordOfDaisy123', role: 'user' },
    { name: 'Huey Duck', email: 'huey@duckberg.com', nickname: 'Bright Huey', password: 'PassWordOfHuey123', role: 'user' },
    { name: 'Louie Duck', email: 'louie@duckberg.com', nickname: 'Lucky Louie', password: 'PassWordOfLouie123', role: 'user' },
    { name: 'Scrooge McDuck', email: 'scrooge@duckberg.com', nickname: 'Rich Uncle', password: 'PassWordOfScrooge123', role: 'user' },
    { name: 'Launchpad McQuack', email: 'launchpad@duckberg.com', nickname: 'Ace Pilot', password: 'PassWordOfLaunchpad123', role: 'user' },
    { name: 'Webby Vanderquack', email: 'webby@duckberg.com', nickname: 'Adventurous Webby', password: 'PassWordOfWebby123', role: 'user' },
  ];

  // Encrypt passwords and seed users
  const usersData = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await encryptPassword(user.password),
    }))
  );

  const createdUsers = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });
  console.log(`Users seeded: ${createdUsers.count}`);

  const allUsers = await prisma.user.findMany();

  // Seed Groups (Random IDs between 1-20)
  const groups = [
    { id: Math.floor(Math.random() * 20) + 1, name: 'Household Family' },
    { id: Math.floor(Math.random() * 20) + 1, name: 'Camping Crew' },
    { id: Math.floor(Math.random() * 20) + 1, name: 'Office Snacks Team' },
    { id: Math.floor(Math.random() * 20) + 1, name: 'Sports Enthusiasts' },
  ];

  const createdGroups = await prisma.group.createMany({
    data: groups,
    skipDuplicates: true,
  });
  console.log(`Groups seeded: ${createdGroups.count}`);

  const allGroups = await prisma.group.findMany();

  // Assign Users to Groups (at least 4 users per group)
  await Promise.all(
    allGroups.map((group, index) =>
      prisma.group.update({
        where: { id: group.id },
        data: {
          users: {
            connect: allUsers.slice(index * 2, (index * 2) + 4).map(user => ({ id: user.id })),
          },
        },
      })
    )
  );
  console.log('Users assigned to groups.');


  const items = Array.from({ length: 16 }, (_, i) => ({
    name: `Item ${i + 1} (${i % 2 === 0 ? 'Food' : 'Drink'})`,
    description: `A delicious ${i % 2 === 0 ? 'snack' : 'refreshing drink'} for your needs.`,
    consumableType: i % 2 === 0 ? 'FOOD' : 'DRINK',
    price: Math.random() * 10,
    weight: i % 3 === 0 ? Math.floor(Math.random() * 1000) : null,
    quantity: Math.floor(Math.random() * 10) + 1,
    isCompleted: Math.random() > 0.5, 
  }));

  const createdItems = await prisma.item.createMany({
    data: items,
    skipDuplicates: true,
  });
  console.log(`Items seeded: ${createdItems.count}`);

  const allItems = await prisma.item.findMany();

  const groceryLists = Array.from({ length: 8 }, (_, i) => ({
    name: `Grocery List ${i + 1}`,
    groupId: allGroups[i % allGroups.length].id,
  }));

  await Promise.all(
    groceryLists.map(async (groceryList, i) => {
      await prisma.groceryList.create({
        data: {
          ...groceryList,
          items: {
            connect: [{ id: allItems[i % allItems.length].id }],
          },
        },
      });
    })
  );
  console.log(`Grocery lists seeded: ${groceryLists.length}`);

  // Seed Messages with more descriptive content
  const messages = Array.from({ length: 8 }, (_, i) => ({
    message: `This is a message for ${allGroups[i % allGroups.length].name} regarding ${allItems[i % allItems.length].name}`,
    timestamp: new Date(),
    userId: allUsers[i % allUsers.length].id,
    groupId: allGroups[i % allGroups.length].id,
  }));

  const createdMessages = await prisma.message.createMany({
    data: messages,
    skipDuplicates: true,
  });
  console.log(`Messages seeded: ${createdMessages.count}`);
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
